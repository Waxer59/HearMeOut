import { IsString } from 'class-validator';
import { BaseDTO } from '../../common/dto/base.dto';

export class FriendRequestDto extends BaseDTO {
  @IsString()
  id: string;
}
