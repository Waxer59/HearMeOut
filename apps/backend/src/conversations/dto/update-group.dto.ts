import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDTO {
  @IsString()
  id: string;

  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  kickUsers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  makeAdmins?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeAdmins?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addUsers?: string[];

  @IsBoolean()
  @IsOptional()
  joinCode?: boolean;
}
