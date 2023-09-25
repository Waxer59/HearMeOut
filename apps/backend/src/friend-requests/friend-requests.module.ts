import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  imports: [CommonModule, UsersModule, ConversationsModule],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
