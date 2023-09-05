import { IsString, MinLength, IsAlpha, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlpha()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  avatar?: any;
}
