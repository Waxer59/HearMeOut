import { IsString } from 'class-validator';
import { BaseDTO } from '../../common/dto/base.dto';

export class TypingDto extends BaseDTO {
  @IsString()
  conversationId: string;
}
