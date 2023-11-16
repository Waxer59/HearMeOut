import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    content,
    fromId,
    toId,
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
          to: {
            connect: { id: toId },
          },
          createdAt: new Date(),
          conversation: {
            connect: {
              id: toId,
            },
          },
          ...replyMsg,
        },
        include: {
          from: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneById(id: string): Promise<Message> {
    try {
      return await this.prisma.message.findUniqueOrThrow({
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

  async deleteById(id: string): Promise<Message> {
    try {
      return await this.prisma.message.delete({
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

  async findAllConversationMessages(
    conversationId: string,
  ): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        where: {
          toId: conversationId,
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
