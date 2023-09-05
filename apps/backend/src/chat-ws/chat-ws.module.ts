import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';

@Module({
  providers: [ChatWsGateway, ChatWsService],
})
export class ChatWsModule {}
