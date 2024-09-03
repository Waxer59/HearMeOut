import { IsString } from 'class-validator';

export class CandidateDto {
  @IsString()
  conversationId: string;

  @IsString()
  candidate: string;
}
