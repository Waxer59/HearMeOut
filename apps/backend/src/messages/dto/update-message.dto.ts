import { IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';
import { BaseDTO } from '../../common/dto/base.dto';

export class UpdateMessageDto extends BaseDTO {
  @IsString()
  messageId: string;

  @IsString()
  @IsNotBlank('content')
  content: string;
}
