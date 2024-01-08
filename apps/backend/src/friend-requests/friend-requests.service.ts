import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { ConversationWithRelations } from 'src/common/types/types';
import { ConversationsService } from 'src/conversations/conversations.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
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
        include: {
          from: true,
          to: true,
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

  async findAllUserReq(userId: string): Promise<{
    outgoingReqs: FriendRequest[];
    incominReqs: FriendRequest[];
  }> {
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

  async accept(id: string): Promise<ConversationWithRelations> {
    try {
      const { fromId: userId1, toId: userId2 } = await this.findById(id);
      // Delete friend req
      await this.delete(id);
      const chat = await this.conversationsService.createChat({
        userId1,
        userId2,
      });

      // Set conversation as active on both users
      const activeConversations = [userId1, userId2].map((userId) =>
        this.usersService.addActiveConversation(userId, chat.id),
      );

      await Promise.all(activeConversations);

      return chat as ConversationWithRelations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async delete(id: string): Promise<FriendRequest> {
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
