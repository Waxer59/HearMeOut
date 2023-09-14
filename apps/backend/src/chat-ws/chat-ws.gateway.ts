import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { CreateChatWDto } from './dto/create-chat-w.dto';
import { UpdateChatWDto } from './dto/update-chat-w.dto';
import { ApiProperty } from '@nestjs/swagger';

@WebSocketGateway({ path: '/chat' })
export class ChatWsGateway {
  constructor(private readonly chatWsService: ChatWsService) {}

  @ApiProperty()
  @SubscribeMessage('createChatW')
  create(@MessageBody() createChatWDto: CreateChatWDto) {
    return this.chatWsService.create(createChatWDto);
  }

  @SubscribeMessage('findAllChatWs')
  findAll() {
    return this.chatWsService.findAll();
  }

  @SubscribeMessage('findOneChatW')
  findOne(@MessageBody() id: number) {
    return this.chatWsService.findOne(id);
  }

  @SubscribeMessage('updateChatW')
  update(@MessageBody() updateChatWDto: UpdateChatWDto) {
    return this.chatWsService.update(updateChatWDto.id, updateChatWDto);
  }

  @SubscribeMessage('removeChatW')
  remove(@MessageBody() id: number) {
    return this.chatWsService.remove(id);
  }
}
