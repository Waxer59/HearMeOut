import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Friend Requests')
@Controller('friend-requests')
@UseGuards(AuthGuard('jwt'))
export class FriendRequestsController {
  constructor(private readonly friendRequestService: FriendRequestsService) {}

  @Get('')
  @ApiCookieAuth('Authorization')
  async getFriendRequests(@Req() req) {
    const { id } = req.user;
    return await this.friendRequestService.findAllByToId(id);
  }

  @Post(':id')
  @ApiCookieAuth('Authorization')
  async create(@Req() req, @Param('id') toId: string) {
    const { id: fromId } = req.user;
    return await this.friendRequestService.create(fromId, toId);
  }

  @Post('accept/:id')
  @ApiCookieAuth('Authorization')
  async accept(@Param('id') id: string) {
    return await this.friendRequestService.accept(id);
  }

  @Delete('deny/:id')
  @ApiCookieAuth('Authorization')
  async delete(@Param('id') id: string) {
    return await this.friendRequestService.delete(id);
  }
}
