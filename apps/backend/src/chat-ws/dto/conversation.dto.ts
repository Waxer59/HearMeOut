import { IsString } from 'class-validator';
import { BaseDTO } from './base.dto';

export class ConversationDto extends BaseDTO {
  @IsString()
  id: string;

  @IsString()
  userId: string;
}
