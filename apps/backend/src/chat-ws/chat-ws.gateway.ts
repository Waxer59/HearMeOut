import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { CreateChatWDto } from './dto/create-chat-w.dto';
import { UpdateChatWDto } from './dto/update-chat-w.dto';
import type { Socket, Server } from 'socket.io';
import { AUTH_COOKIE, CHAT_EVENTS } from 'src/common/constants/contstants';
import { parseCookies } from 'src/common/helpers/cookies';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatWsService: ChatWsService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

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

  handleConnection(client: Socket) {
    client.broadcast.emit(CHAT_EVENTS.userConnect, 'asdasd');
  }

  handleDisconnect(client: Socket) {
    // console.log(client);
  }

  afterInit(client: Socket) {
    client.use(async (client: any, next: any) => {
      const rawCookies = client.request.headers.cookie;
      const parsedCookies = parseCookies(rawCookies);
      const token = parsedCookies[AUTH_COOKIE];

      try {
        await this.authService.verify(token);
      } catch (err) {
        next(err);
      }

      next();
    });
  }
}
