import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationsModule } from './configurations/configurations.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { FriendsModule } from './friends/friends.module';
import { MessagesModule } from './messages/messages.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().uri().required(),
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        API_URL: Joi.string().uri().required(),
        PORT: Joi.number().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    ChatWsModule,
    ConfigurationsModule,
    FriendRequestsModule,
    FriendsModule,
    MessagesModule,
  ],
})
export class AppModule {}
