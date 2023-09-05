import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ChatWsModule } from './chat-ws/chat-ws.module';

@Module({
  imports: [AuthModule, UsersModule, CommonModule, ChatWsModule],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
