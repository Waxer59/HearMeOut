import { IsString } from 'class-validator';

export class BaseDTO {
  @IsString()
  userId: string;
}
