import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';
import { BaseDTO } from './base.dto';

export class SendMessageDto extends BaseDTO {
  @IsString()
  toId: string;

  @IsString()
  @IsNotBlank('content')
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;
}
