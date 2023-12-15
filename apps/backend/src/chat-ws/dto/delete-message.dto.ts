import { IsString } from 'class-validator';
import { BaseDTO } from './base.dto';

export class DeleteMessageDto extends BaseDTO {
  @IsString()
  messageId: string;
}
