import { IsString, MaxLength, MinLength } from 'class-validator';
import { JOIN_CODE_LENGTH } from 'src/common/constants/constants';

export class JoinGroupDto {
  @IsString()
  @MaxLength(JOIN_CODE_LENGTH)
  @MinLength(JOIN_CODE_LENGTH)
  joinCode: string;
}
