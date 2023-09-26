import {
  Controller,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { excludeUserFields } from 'src/common/helpers/excludeUserFields';

@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiCookieAuth('Authorization')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return excludeUserFields(user, ['password', 'githubId']);
  }

  @Patch('')
  @ApiCookieAuth('Authorization')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    return await this.usersService.updateById(id, updateUserDto);
  }

  @Patch('active-conversations/:id')
  @ApiCookieAuth('Authorization')
  async updateActiveConversations(@Req() req, @Param('id') id: string) {
    const { id: userId } = req.user;
    return await this.usersService.setActiveConversationFirst(userId, id);
  }

  @Delete('active-conversations/:id')
  @ApiCookieAuth('Authorization')
  async removeActiveConversations(@Req() req, @Param('id') id: string) {
    const { id: userId } = req.user;
    return await this.usersService.removeActiveConversation(userId, id);
  }

  @Delete('')
  @ApiCookieAuth('Authorization')
  async remove(@Req() req) {
    const { id } = req.user;
    return await this.usersService.remove(id);
  }

  @Get('search-username/:name')
  @ApiCookieAuth('Authorization')
  async searchUsername(@Req() req, @Param('name') name: string) {
    const { id: userId } = req.user;
    const users = await this.usersService.findAllByUsernamesLike(userId, name);
    return users;
  }
}
