import { IsString } from 'class-validator';

export class OfferDto {
  @IsString()
  conversationId: string;

  @IsString()
  offer: string;
}
