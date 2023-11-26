import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class CreateMessageDto {
  @IsString()
  fromId: string;

  @IsString()
  toId: string;

  @IsString()
  @IsNotBlank('content')
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;
}
