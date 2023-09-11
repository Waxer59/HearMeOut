import {
  IsString,
  MinLength,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
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
