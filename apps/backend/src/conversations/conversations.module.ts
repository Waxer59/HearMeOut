import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  imports: [CommonModule],
  exports: [ConversationsService],
})
export class ConversationsModule {}
