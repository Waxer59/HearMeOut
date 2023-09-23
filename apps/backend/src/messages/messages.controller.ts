import {
  Controller,
  UseGuards,
  Get,
  Param,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':id')
  @ApiCookieAuth('Authorization')
  async getMessages(@Param('id') id: string, @Req() req) {
    // const { conversationsIds } = req.user;

    // if (!conversationsIds?.includes(id)) {
    //   throw new NotFoundException('Conversation not found');
    // }

    return await this.messagesService.findAllConversationMessages(id);
  }
}
