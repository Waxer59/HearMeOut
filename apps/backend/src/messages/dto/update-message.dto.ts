import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class UpdateMessageDto {
  @IsString()
  messageId: string;

  @IsString()
  @IsNotBlank()
  content: string;
}
