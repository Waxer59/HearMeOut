import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [AuthModule],
})
export class ChatWsModule {}
