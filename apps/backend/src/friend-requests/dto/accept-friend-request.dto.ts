import { IsString } from 'class-validator';

export class AcceptFriendRequestDto {
  @IsString()
  id: string;
}
