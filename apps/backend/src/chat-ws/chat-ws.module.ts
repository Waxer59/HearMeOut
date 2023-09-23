import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [AuthModule, UsersModule, MessagesModule],
})
export class ChatWsModule {}
