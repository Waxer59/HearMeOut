import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  userId1: string;

  @IsString()
  userId2: string;
}
