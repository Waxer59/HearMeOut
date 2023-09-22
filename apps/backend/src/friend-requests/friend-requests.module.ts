import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { FriendsModule } from 'src/conversations/friends.module';

@Module({
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  imports: [CommonModule, UsersModule, FriendsModule],
})
export class FriendRequestsModule {}
