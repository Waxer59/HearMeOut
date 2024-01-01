import { IsBoolean, IsString } from 'class-validator';

export class RemoveFriendRequestDto {
  @IsString()
  id: string;

  @IsBoolean()
  isOutgoing: boolean;
}
