import { IsString } from 'class-validator';
import { BaseDTO } from './base.dto';

export class TypingDto extends BaseDTO {
  @IsString()
  conversationId: string;
}
