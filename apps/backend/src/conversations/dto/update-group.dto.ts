import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';

export class UpdateGroupDTO extends BaseDTO {
  @IsString()
  id: string;

  @IsOptional()
  icon?: Express.Multer.File;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  kickUsers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addUsers?: string[];
}
