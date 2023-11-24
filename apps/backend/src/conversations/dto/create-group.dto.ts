import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3)
  userIds: string[];
}
