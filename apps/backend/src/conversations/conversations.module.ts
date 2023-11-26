import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { CommonModule } from 'src/common/common.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  imports: [CommonModule, CloudinaryModule],
  exports: [ConversationsService],
})
export class ConversationsModule {}
