import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  fromId: string;

  @IsString()
  toId: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;
}
