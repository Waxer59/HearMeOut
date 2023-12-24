import { IsString } from 'class-validator';

export class ConversationActionsDto {
  @IsString()
  id: string;
}
