import { IsString } from 'class-validator';
import { BaseDTO } from './base.dto';

export class FriendRequestDto extends BaseDTO {
  @IsString()
  id: string;
}
