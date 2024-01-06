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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    creatorId: string,
  ): Promise<Conversation> {
    try {
      return await this.prisma.conversation.create({
        data: {
          name: createGroupDto.name,
          userIds: createGroupDto.userIds,
          creatorId,
          users: {
            connect: createGroupDto.userIds.map((userId) => ({
              id: userId,
            })),
          },
          admins: {
            connect: {
              id: creatorId,
            },
          },
          type: CONVERSATION_TYPE.group,
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

  async kickGroupUser(
    userId: string,
    conversationId: string,
  ): Promise<Conversation> {
    try {
      await this.usersService.removeActiveConversation(userId, conversationId);
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

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await this.prisma.message.updateMany({
        where: {
          conversationId,
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
    file: string,
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

      const { public_id, secure_url } =
        await this.cloudinaryService.uploadImage(file);

      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          icon_public_id: public_id,
          icon: secure_url,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateGroup(updateGroupDto: UpdateGroupDTO): Promise<Conversation> {
    const { id, icon, addUsers, kickUsers, ...rest } = updateGroupDto;

    if (icon) {
      await this.updateIcon(id, icon);
    }

    if (addUsers?.length > 0) {
      const addUserPromises = addUsers.map((addUserId) =>
        this.addGroupUser(id, addUserId),
      );
      try {
        await Promise.all(addUserPromises);
      } catch (error) {}
    }

    if (kickUsers?.length > 0) {
      const kickUsersPromises = kickUsers.map((kickUserId) =>
        this.kickGroupUser(kickUserId, id),
      );
      try {
        await Promise.all(kickUsersPromises);
      } catch (error) {}
    }

    // Update the rest of the parameters that
    // dont require special actions
    if (Object.keys(rest).length) {
      const { makeAdmins, removeAdmins, ...fields } = rest;
      const newAdmins = makeAdmins?.length
        ? {
            admins: {
              connect: makeAdmins.map((id) => ({ id })),
            },
          }
        : {};
      const removedAdmins = removeAdmins?.length
        ? {
            admins: {
              disconnect: removeAdmins.map((id) => ({ id })),
            },
          }
        : {};
      await this.prisma.conversation.update({
        where: {
          id,
        },
        data: {
          ...fields,
          ...newAdmins,
          ...removedAdmins,
        },
      });
    }

    return await this.findById(id);
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
      console.log(error);
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

      // Remove active conversation from users
      await this.usersService.removeActiveConversationFromAllUsers(id);

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
