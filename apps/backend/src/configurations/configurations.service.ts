import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { Configuration } from '@prisma/client';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    id: string,
    createConfigurationDto: CreateConfigurationDto,
  ): Promise<Configuration> {
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

  async update(
    id: string,
    config: UpdateConfigurationDto,
  ): Promise<Configuration> {
    const userConfig = await this.findByUserId(id);

    if (!userConfig) {
      return await this.create(id, config as CreateConfigurationDto);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, userId, ...currConfig } = userConfig;

    try {
      return await this.prismaService.configuration.update({
        where: { userId },
        data: {
          ...currConfig,
          ...config,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async findByUserId(userId: string): Promise<Configuration> {
    try {
      const configuration = await this.prismaService.configuration.findUnique({
        where: { userId },
      });
      return configuration;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
