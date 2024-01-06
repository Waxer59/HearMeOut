import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';
import { MessageWithRelations } from 'src/common/types/types';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    content,
    fromId,
    conversationId,
    replyId,
  }: CreateMessageDto): Promise<Message> {
    const replyMsg = replyId
      ? {
          reply: {
            connect: {
              id: replyId,
            },
          },
        }
      : {};

    try {
      return await this.prisma.message.create({
        data: {
          content,
          from: {
            connect: { id: fromId },
          },
          conversation: {
            connect: { id: conversationId },
          },
          createdAt: new Date(),
          ...replyMsg,
        },
        include: {
          from: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneById(id: string): Promise<MessageWithRelations> {
    try {
      return await this.prisma.message.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          replies: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateById(messageId: string, content: string): Promise<Message> {
    try {
      return await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          content,
          isEdited: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeReply(messageId: string, replyId: string): Promise<Message> {
    try {
      return await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          replies: {
            disconnect: {
              id: replyId,
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

  async deleteById(id: string): Promise<Message> {
    const msg = await this.findOneById(id);

    // Delete the relation with the replies
    const replies = msg.replies.map(async (reply) =>
      this.removeReply(id, reply.id),
    );

    try {
      await Promise.all(replies);

      return await this.prisma.message.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllConversationMessages(
    conversationId: string,
  ): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        where: {
          conversationId,
        },
        include: {
          from: {
            select: {
              id: true,
              username: true,
              avatar: true,
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
}
