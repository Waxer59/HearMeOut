import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createConfigurationDto: any) {
    return 'This action adds a new configuration';
  }

  async update(id: string, config: UpdateConfigurationDto) {
    const userConfig = this.findByUserId(id);

    if (!userConfig) {
      return await this.create(config);
    }

    return 'This action updates a #${id} configuration';
  }

  async findByUserId(id: string) {
    try {
      const configuration = await this.prismaService.configuration.findUnique({
        where: { userId: id },
        include: {
          user: true,
        },
      });
      return configuration;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
