import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [MessagesService],
  imports: [CommonModule],
})
export class MessagesModule {}
