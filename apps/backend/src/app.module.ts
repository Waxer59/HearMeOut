import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [AuthModule, UsersModule, MessagesWsModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
