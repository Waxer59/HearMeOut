import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Friend } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId1: string, userId2: string): Promise<Friend> {
    const friend = await this.findFriend(userId1, userId2);

    if (friend) {
      throw new BadRequestException('Friend already exists');
    }

    try {
      return await this.prisma.friend.create({
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
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllFriends(userId: string): Promise<Friend[]> {
    try {
      return await this.prisma.friend.findMany({
        where: {
          userIds: {
            hasEvery: [userId],
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findFriend(userId1: string, userId2: string): Promise<Friend> {
    try {
      return await this.prisma.friend.findFirst({
        where: {
          userIds: {
            hasEvery: [userId1, userId2],
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async remove(id: string): Promise<Friend> {
    try {
      return await this.prisma.friend.delete({
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
