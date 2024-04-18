import { Transform } from 'class-transformer';
import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(39)
  @IsNotBlank()
  @Transform(({ value }) => value.toLowerCase().trim())
  username: string;

  @IsString()
  @MinLength(8)
  @IsNotBlank()
  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  githubId?: string;
}
