import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { CONVERSATION_TYPE } from 'src/common/types/types';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateGroupDTO } from './dto/update-group.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Conversation> {
    try {
      return await this.prisma.conversation.create({
        data: {
          name: createGroupDto.name,
          userIds: createGroupDto.userIds,
          users: {
            connect: createGroupDto.userIds.map((userId) => ({
              id: userId,
            })),
          },
          admins: {
            connect: {
              id: createGroupDto.creatorId,
            },
          },
          type: CONVERSATION_TYPE.group,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async createChat(createChatDto: CreateChatDto): Promise<Conversation> {
    const { userId1, userId2 } = createChatDto;
    const friend = await this.findChat(userId1, userId2);

    if (friend) {
      throw new BadRequestException('Chat already exists');
    }

    try {
      return await this.prisma.conversation.create({
        data: {
          userIds: [userId1, userId2],
          users: {
            connect: [
              {
                id: userId1,
              },
              {
                id: userId2,
              },
            ],
          },
          type: CONVERSATION_TYPE.chat,
        },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isOnline: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async kickUser(
    userId: string,
    conversationId: string,
  ): Promise<Conversation> {
    try {
      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          users: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async removeAdmin(
    userId: string,
    conversationId: string,
    adminId: string,
  ): Promise<Conversation> {
    try {
      const { adminIds } = await this.findById(conversationId);

      if (!adminIds.includes(adminId)) {
        return;
      }

      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          admins: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async makeAdmin(userId, conversationId, adminId): Promise<Conversation> {
    try {
      const { adminIds } = await this.findById(conversationId);

      if (!adminIds.includes(adminId)) {
        return;
      }

      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          admins: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllByUserId(userId: string): Promise<Conversation[]> {
    try {
      return await this.prisma.conversation.findMany({
        where: {
          userIds: {
            hasEvery: [userId],
          },
          type: CONVERSATION_TYPE.chat,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findChat(userId1: string, userId2: string): Promise<Conversation> {
    try {
      return await this.prisma.conversation.findFirst({
        where: {
          userIds: {
            hasEvery: [userId1, userId2],
          },
          type: CONVERSATION_TYPE.chat,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findById(id: string): Promise<Conversation> {
    try {
      return await this.prisma.conversation.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await this.prisma.message.updateMany({
        where: {
          toId: conversationId,
          NOT: {
            viewedByIds: {
              has: userId,
            },
          },
        },
        data: {
          viewedByIds: {
            push: userId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateIcon(
    conversationId: string,
    file: Express.Multer.File,
  ): Promise<Conversation> {
    try {
      const { type, icon_public_id } = await this.findById(conversationId);

      // Icon is only available in group conversations
      if (type !== CONVERSATION_TYPE.group) {
        return;
      }

      // Delete previous icon
      if (icon_public_id) {
        await this.cloudinaryService.deleteImage(icon_public_id);
      }

      const { public_id } = await this.cloudinaryService.uploadImage(file);

      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          icon_public_id: public_id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateGroup(updateGroupDto: UpdateGroupDTO): Promise<Conversation> {
    const { id, userId, icon, addUsers, kickUsers } = updateGroupDto;
    const group = await this.findById(id);
    const isUserAdmin = group.adminIds.includes(userId);
    const existsGroupIcon =
      group.type === CONVERSATION_TYPE.group && group.icon;

    if (!isUserAdmin) {
      return;
    }

    if (icon && existsGroupIcon) {
      await this.updateIcon(id, icon);
    }

    if (addUsers) {
      const addUserPromises = addUsers.map((addUserId) =>
        this.addGroupUser(id, addUserId),
      );
      await Promise.all(addUserPromises);
    }

    if (kickUsers) {
      const kickUsersPromises = kickUsers.map((kickUserId) =>
        this.kickUser(kickUserId, id),
      );
      await Promise.all(kickUsersPromises);
    }
  }

  async addGroupUser(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    try {
      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async remove(id: string): Promise<Conversation> {
    try {
      const deletedConversation = await this.prisma.conversation.delete({
        where: {
          id,
        },
      });
      const existsGroupIcon =
        deletedConversation.type === CONVERSATION_TYPE.group &&
        deletedConversation.icon_public_id;

      // Delete group icon if exists
      if (existsGroupIcon) {
        this.cloudinaryService.deleteImage(deletedConversation.icon_public_id);
      }

      return deletedConversation;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
