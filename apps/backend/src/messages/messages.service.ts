import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    content,
    fromId,
    chatId,
    toId,
  }: CreateMessageDto): Promise<Message> {
    try {
      return await this.prisma.message.create({
        data: {
          content,
          fromId,
          toId,
          createdAt: new Date(),
          friend: {
            connect: {
              id: chatId,
            },
          },
        },
      });
    } catch (error) {}
  }
}
