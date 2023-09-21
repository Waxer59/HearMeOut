import { Theme } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateConfigurationDto {
  @IsString()
  @IsOptional()
  theme: Theme = 'dark';
}
