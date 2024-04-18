import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotBlank()
  @MaxLength(39)
  @Transform(({ value }) => value.toLowerCase().trim())
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotBlank()
  password: string;
}
