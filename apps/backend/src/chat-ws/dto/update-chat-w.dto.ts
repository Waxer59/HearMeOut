import { PartialType } from '@nestjs/mapped-types';
import { CreateChatWDto } from './create-chat-w.dto';

export class UpdateChatWDto extends PartialType(CreateChatWDto) {
  id: number;
}
