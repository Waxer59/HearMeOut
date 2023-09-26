import { IsString } from 'class-validator';

export class ConversationDto {
  @IsString()
  id: string;
}
