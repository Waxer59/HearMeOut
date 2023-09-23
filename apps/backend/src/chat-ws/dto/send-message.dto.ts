import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  toId: string;

  @IsString()
  content: string;
}
