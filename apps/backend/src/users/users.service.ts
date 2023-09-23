import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/db/prisma.service';
import { User } from '@prisma/client';
import { generateHash } from 'src/common/helpers/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.findOneByUsername(createUserDto.username);

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    if (createUserDto.password) {
      createUserDto.password = generateHash({
        raw: createUserDto.password,
      });
    }

    try {
      return await this.prisma.user.create({
        data: createUserDto,
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
      return await this.prisma.user.findUnique({ where: { githubId } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
        include: {
          conversationsJoined: {
            include: {
              users: {
                where: {
                  id: {
                    not: id,
                  },
                },
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  isOnline: true,
                },
              },
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

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findAllByUsernamesLike(
    excludeUser: string,
    username: string,
  ): Promise<any[]> {
    try {
      return await this.prisma.user.findMany({
        where: {
          username: {
            contains: username,
            mode: 'insensitive',
          },
          NOT: {
            username: excludeUser,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
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

    while (true) {
      const existingUser = await this.findOneByUsername(newUsername);
      if (!existingUser) {
        break;
      }

      newUsername = `${username}${suffix}`;
      suffix++;
    }

    return newUsername;
  }

  async addActiveChat(userId: string, activeConversationId: string) {
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

  async removeActiveChat(userId: string, activeChatId: string) {
    try {
      const user = await this.findOneById(userId);

      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          activeConversationIds: user.activeConversationIds.filter(
            (chatId) => chatId !== activeChatId,
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
