import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupDTO {
  @IsString()
  id: string;

  @IsString()
  adminId: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
