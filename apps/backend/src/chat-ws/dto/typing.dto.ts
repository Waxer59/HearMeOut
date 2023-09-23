import { IsString } from 'class-validator';

export class TypingDto {
  @IsString()
  conversationId: string;
}
