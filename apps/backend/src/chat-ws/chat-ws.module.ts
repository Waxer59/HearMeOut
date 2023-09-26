import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [
    AuthModule,
    UsersModule,
    MessagesModule,
    FriendRequestsModule,
    ConversationsModule,
  ],
})
export class ChatWsModule {}
