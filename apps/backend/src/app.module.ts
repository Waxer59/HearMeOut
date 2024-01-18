import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigurationsModule } from './configurations/configurations.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { CachingModule } from './caching/caching.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import * as Joi from 'joi';
import { NodeEnvironment } from './common/types/types';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().uri().required(),
        API_URL: Joi.string().uri().required(),
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid(...Object.values(NodeEnvironment))
          .required(),
      }),
    }),
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
            tls: configService.get('NODE_ENV') === NodeEnvironment.PROD,
          },
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    ChatWsModule,
    ConfigurationsModule,
    FriendRequestsModule,
    ConversationsModule,
    MessagesModule,
    CachingModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
