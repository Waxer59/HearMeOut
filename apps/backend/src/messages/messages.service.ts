import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ content, fromId, toId }: CreateMessageDto): Promise<Message> {
    try {
      return await this.prisma.message.create({
        data: {
          content,
          fromId,
          toId,
          createdAt: new Date(),
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

  async findAllConversationMessages(chatId: string): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        where: {
          toId: chatId,
        },
        include: {
          from: {
            select: {
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
