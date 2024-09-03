import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { CONVERSATION_TYPE } from 'src/common/types/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { nanoid } from 'nanoid';
import { JOIN_CODE_LENGTH } from 'src/common/constants/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDTO } from './dto/update-group.dto';

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
          users: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async joinGroupWithJoinCode(
    userId: string,
    joinCode: string,
  ): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        joinCode,
      },
    });

    if (!conversation) {
      throw new BadRequestException('Invalid join code');
    }

    if (conversation.userIds.includes(userId)) {
      throw new BadRequestException('You are already in this conversation');
    }

    try {
      return await this.prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          users: true,
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
          users: true,
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
    const conversation = await this.findById(conversationId);

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
          adminIds: {
            set: conversation.adminIds.filter((id) => id !== userId),
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

  async makeAdmin(
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
          users: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeJoinCode(conversationId: string): Promise<Conversation> {
    try {
      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          joinCode: null,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async generateJoinCode(conversationId: string): Promise<Conversation> {
    const newCode = nanoid(JOIN_CODE_LENGTH);
    try {
      return await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          joinCode: newCode,
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
    const { id, icon, addUsers, kickUsers, joinCode, ...rest } = updateGroupDto;

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

    if (joinCode) {
      await this.generateJoinCode(id);
    } else if (joinCode !== undefined) {
      await this.removeJoinCode(id);
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
    let deletedConversation: Conversation;
    try {
      deletedConversation = await this.prisma.conversation.delete({
        omit: {
          icon_public_id: false,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }

    // Remove active conversation from users
    await this.usersService.removeActiveConversationFromAllUsers(id);

    // Remove conversation notification from users
    await this.usersService.removeConversationNotificationFromAllUsers(id);

    const existsGroupIcon =
      deletedConversation.type === CONVERSATION_TYPE.group &&
      deletedConversation.icon_public_id;

    // Delete group icon if exists
    if (existsGroupIcon) {
      await this.cloudinaryService.deleteImage(
        deletedConversation.icon_public_id,
      );
    }

    return deletedConversation;
  }
}
