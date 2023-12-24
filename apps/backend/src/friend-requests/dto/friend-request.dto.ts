import { IsString } from 'class-validator';

export class FriendRequestDto {
  @IsString()
  id: string;
}
