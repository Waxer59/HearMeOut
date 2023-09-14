import { Transform } from 'class-transformer';
import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(39)
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  githubId?: string;
}
