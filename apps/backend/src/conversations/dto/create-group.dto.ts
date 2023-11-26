import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class CreateGroupDto {
  @IsString()
  creatorId: string;

  @IsString()
  @MinLength(3)
  @IsNotBlank('name')
  @MaxLength(24)
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3)
  userIds: string[];
}
