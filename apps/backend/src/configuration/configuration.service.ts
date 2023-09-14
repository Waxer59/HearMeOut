import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id: string, createConfigurationDto: CreateConfigurationDto) {
    const userConfig = await this.findByUserId(id);

    if (userConfig) {
      return await this.update(id, createConfigurationDto);
    }

    try {
      return await this.prismaService.configuration.create({
        data: {
          ...createConfigurationDto,
          user: { connect: { id } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async update(id: string, config: UpdateConfigurationDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, userId, ...userConfig } = await this.findByUserId(id);

    if (!userConfig) {
      return await this.create(id, config as CreateConfigurationDto);
    }

    try {
      return await this.prismaService.configuration.update({
        where: { userId: id },
        data: {
          ...userConfig,
          ...config,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findByUserId(id: string) {
    try {
      const configuration = await this.prismaService.configuration.findUnique({
        where: { userId: id },
      });
      return configuration;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
