import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Friend Requests')
@ApiCookieAuth('Authorization')
@Controller('friend-requests')
@UseGuards(AuthGuard('jwt'))
export class FriendRequestsController {
  constructor(private readonly friendRequestService: FriendRequestsService) {}

  @Get('')
  async getFriendRequests(@Req() req) {
    const { id } = req.user;
    return await this.friendRequestService.findAllByToId(id);
  }
}
