import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  fromId: string;

  @IsString()
  toId: string;

  @IsString()
  content: string;

  @IsString()
  chatId: string;
}
