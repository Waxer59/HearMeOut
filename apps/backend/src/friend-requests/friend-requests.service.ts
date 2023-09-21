import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { FriendsService } from 'src/friends/friends.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
  ) {}

  async create(fromId: string, toId: string): Promise<FriendRequest> {
    const userTo = await this.usersService.findOneById(toId);

    if (fromId === toId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    if (!userTo) {
      throw new BadRequestException('User not found');
    }

    const findReq = await this.findOne(fromId, toId);

    if (findReq) {
      throw new BadRequestException('Request already exists');
    }

    try {
      return await this.prisma.friendRequest.create({
        data: {
          fromId,
          toId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOne(fromId: string, toId: string): Promise<FriendRequest> {
    try {
      return await this.prisma.friendRequest.findFirst({
        where: {
          fromId,
          toId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllUserReq(userId: string) {
    try {
      const outgoingReqs = await this.findAllByFromId(userId);
      const incominReqs = await this.findAllByToId(userId);
      return {
        outgoingReqs,
        incominReqs,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllByToId(toId: string): Promise<FriendRequest[]> {
    try {
      return await this.prisma.friendRequest.findMany({
        where: {
          toId,
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

  async findAllByFromId(fromId: string): Promise<FriendRequest[]> {
    try {
      return await this.prisma.friendRequest.findMany({
        where: {
          fromId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findById(id: string): Promise<FriendRequest> {
    try {
      return await this.prisma.friendRequest.findFirst({
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

  async accept(id: string) {
    try {
      const { fromId, toId } = await this.findById(id);
      await this.delete(id);
      return await this.friendsService.create(fromId, toId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.friendRequest.delete({
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
