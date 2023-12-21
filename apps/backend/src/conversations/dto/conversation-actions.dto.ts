import { IsString } from 'class-validator';
import { BaseDTO } from '../../common/dto/base.dto';

export class ConversationActionsDto extends BaseDTO {
  @IsString()
  id: string;
}
