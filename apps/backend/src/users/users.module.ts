import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from 'src/common/common.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CommonModule, ConversationsModule],
  exports: [UsersService],
})
export class UsersModule {}
