import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  userIds: string[];
}
