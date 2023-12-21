import { IsString } from 'class-validator';
import { BaseDTO } from '../../common/dto/base.dto';

export class DeleteMessageDto extends BaseDTO {
  @IsString()
  messageId: string;
}
