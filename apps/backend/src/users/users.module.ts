import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from 'src/common/common.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CommonModule, ConversationsModule, CloudinaryModule],
  exports: [UsersService],
})
export class UsersModule {}
