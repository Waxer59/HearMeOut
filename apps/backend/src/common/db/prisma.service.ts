import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        user: {
          password: true,
          githubId: true,
          isGithubAccount: true,
          activeConversationIds: true,
          adminConversationIds: true,
          avatar_public_id: true,
          conversationIds: true,
          conversationNotificationIds: true,
        },
        conversation: {
          icon_public_id: true,
        },
        configuration: {
          userId: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
