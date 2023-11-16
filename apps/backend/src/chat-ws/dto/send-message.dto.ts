import { IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  toId: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;
}
