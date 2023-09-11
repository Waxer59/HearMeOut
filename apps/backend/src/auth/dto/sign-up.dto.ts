import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsAlphanumeric } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
