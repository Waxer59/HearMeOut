import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  @IsNotBlank()
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;
}
