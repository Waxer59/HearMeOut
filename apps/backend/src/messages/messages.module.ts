import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CommonModule } from 'src/common/common.module';
import { MessagesController } from './messages.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [MessagesService],
  imports: [CommonModule, UsersModule],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
