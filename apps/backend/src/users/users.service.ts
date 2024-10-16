import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { User } from '@prisma/client';
import { generateHash } from 'src/common/helpers/bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { base64File } from 'src/common/helpers/base64File';
import { CONVERSATION_TYPE, UserWithRelations } from 'src/common/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, githubId } = createUserDto;
    const findUser = await this.findOneByUsername(username);
    const isGithubAccount = Boolean(githubId);

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    if (password) {
      createUserDto.password = generateHash({
        raw: password,
      });
    }

    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          isGithubAccount,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        omit: {
          password: false,
          githubId: false,
          activeConversationIds: false,
          adminConversationIds: false,
          avatar_public_id: false,
          conversationIds: false,
          conversationNotificationIds: false,
        },
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneByGithubId(githubId: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        omit: {
          password: false,
          githubId: false,
          activeConversationIds: false,
          adminConversationIds: false,
          avatar_public_id: false,
          conversationIds: false,
          conversationNotificationIds: false,
        },
        where: { githubId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneById(id: string): Promise<UserWithRelations> {
    try {
      const user = (await this.prisma.user.findFirst({
        omit: {
          password: false,
          githubId: false,
          activeConversationIds: false,
          adminConversationIds: false,
          avatar_public_id: false,
          conversationIds: false,
          conversationNotificationIds: false,
        },
        where: { id },
        include: {
          configuration: true,
          conversations: {
            include: {
              users: true,
            },
          },
          friendReqFroms: {
            include: {
              to: true,
            },
          },
          friendReqTos: {
            include: {
              from: true,
            },
          },
        },
      })) as unknown as UserWithRelations;

      // Post-process to omit the requesting user from the conversations users
      // if the conversation is of the chat type
      if (user && user.conversations) {
        user.conversations = user.conversations.map((conversation) => {
          if (conversation.type === CONVERSATION_TYPE.chat) {
            conversation.users = conversation.users.filter(
              (user) => user.id !== id,
            );
          }

          return conversation;
        });
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOneById(id);

    if (avatar) {
      if (user.avatar_public_id) {
        await this.cloudinaryService.deleteImage(user.avatar_public_id);
      }

      const { secure_url, public_id } =
        await this.cloudinaryService.uploadImage(base64File(avatar));
      updateUserDto.avatar = secure_url;
      updateUserDto.avatar_public_id = public_id;
    }

    if (updateUserDto.password) {
      updateUserDto.password = generateHash({
        raw: updateUserDto.password,
      });
    }

    if (updateUserDto.username) {
      const findUser = await this.findOneByUsername(updateUserDto.username);
      if (findUser) {
        throw new BadRequestException('Username already exists');
      }
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        omit: {
          password: false,
          githubId: false,
          activeConversationIds: false,
          adminConversationIds: false,
          avatar_public_id: false,
          conversationIds: false,
          conversationNotificationIds: false,
        },
        where: { id },
      });

      // If the image is uploaded to cloudinary, delete it
      if (user.avatar_public_id) {
        await this.cloudinaryService.deleteImage(user.avatar_public_id);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeActiveConversationFromAllUsers(
    conversationId: string,
  ): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        activeConversationIds: {
          has: conversationId,
        },
      },
    });

    try {
      const updatedUsers = users.map((user) => {
        if (!user.activeConversationIds) {
          return;
        }

        return this.prisma.user.update({
          where: { id: user.id },
          data: {
            activeConversationIds: {
              set: user.activeConversationIds.filter(
                (activeConversationId) =>
                  activeConversationId !== conversationId,
              ),
            },
          },
        });
      });
      await Promise.all(updatedUsers);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  private async getConversationNotificationFromAllUsers(
    conversationId: string,
  ): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: {
          conversationNotificationIds: {
            has: conversationId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeConversationNotificationFromAllUsers(
    conversationId: string,
  ): Promise<void> {
    const users =
      await this.getConversationNotificationFromAllUsers(conversationId);
    try {
      const updatedUsers = users.map((user) => {
        if (!user.conversationNotificationIds) {
          return;
        }

        return this.prisma.user.update({
          where: { id: user.id },
          data: {
            conversationNotificationIds: {
              set: user.conversationNotificationIds.filter(
                (notificationId) => notificationId !== conversationId,
              ),
            },
          },
        });
      });
      await Promise.all(updatedUsers);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async addConversationNotification(
    userId: string,
    conversationId: string,
  ): Promise<User> {
    const user = await this.findOneById(userId);
    const hasAlreadyBeenNotified =
      user.conversationNotificationIds.includes(conversationId);

    if (hasAlreadyBeenNotified) {
      return user;
    }

    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          conversationNotificationIds: {
            push: conversationId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeConversationNotification(
    userId: string,
    conversationId: string,
  ): Promise<User> {
    const { conversationNotificationIds } = await this.findOneById(userId);
    const updatedConversationNotificationIds =
      conversationNotificationIds.filter(
        (notificationId) => notificationId !== conversationId,
      );

    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          conversationNotificationIds: {
            set: updatedConversationNotificationIds,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllByUsernamesLike(
    finderUserId: string,
    username: string,
  ): Promise<any[]> {
    // It's necessary to exclude the users
    // who are already in the chat with the finder user.
    const user = await this.findOneById(finderUserId);
    const excludeUsersIds = user.conversations.reduce((acc, curr) => {
      if (curr.type === CONVERSATION_TYPE.group) {
        return acc;
      }
      const chatUser = curr.users.filter((user) => user.id !== finderUserId)[0]
        .id;
      acc.push(chatUser);
      return acc;
    }, []);

    // Exclude own user
    excludeUsersIds.push(finderUserId);

    try {
      return await this.prisma.user.findMany({
        where: {
          username: {
            contains: username,
            mode: 'insensitive',
          },
          NOT: {
            id: {
              in: excludeUsersIds,
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

  async generateUniqueUsername(username: string): Promise<string> {
    let newUsername = username;
    let suffix = 1;
    let isUnique = false;

    do {
      const existingUser = await this.findOneByUsername(newUsername);

      if (existingUser) {
        newUsername = `${username}${suffix}`;
        suffix++;
      } else {
        isUnique = true;
      }
    } while (!isUnique);

    return newUsername;
  }

  async addActiveConversation(
    userId: string,
    activeConversationId: string,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          activeConversationIds: {
            push: activeConversationId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeActiveConversation(
    userId: string,
    activeConversationId: string,
  ): Promise<User> {
    try {
      const user = await this.findOneById(userId);

      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          activeConversationIds: user.activeConversationIds.filter(
            (conversationId) => conversationId !== activeConversationId,
          ),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async removeConversation(userId: string, conversationId: string) {
    try {
      const user = await this.findOneById(userId);
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          conversationIds: user.conversationIds.filter(
            (id) => id !== conversationId,
          ),
          activeConversationIds: user.activeConversationIds.filter(
            (id) => id !== conversationId,
          ),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async setIsOnline(userId: string, isOnline: boolean) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { isOnline },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
