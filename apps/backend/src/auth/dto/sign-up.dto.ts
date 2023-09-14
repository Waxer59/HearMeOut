import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(39)
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
