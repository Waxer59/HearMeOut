import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { CONVERSATION_TYPE } from 'src/common/types/types';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(userId1: string, userId2: string): Promise<Conversation> {
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

  async findAllChats(userId: string): Promise<Conversation[]> {
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

  async findConversationById(id: string): Promise<Conversation> {
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

  async removeUserFromConversation(
    userId: string,
    conversationId: string,
  ): Promise<Conversation> {
    const conversation = await this.findConversationById(conversationId);

    if (conversation.userIds.length <= 1) {
      try {
        return await this.remove(conversationId);
      } catch (error) {
        throw new InternalServerErrorException(
          'Something went wrong, please try again later',
        );
      }
    }

    try {
      const conversation = await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          users: {
            disconnect: [{ id: userId }],
          },
        },
      });
      return conversation;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async remove(id: string): Promise<Conversation> {
    try {
      return await this.prisma.conversation.delete({
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
}
