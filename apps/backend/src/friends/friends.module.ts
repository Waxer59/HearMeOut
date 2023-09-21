import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
  imports: [CommonModule],
  exports: [FriendsService],
})
export class FriendsModule {}
