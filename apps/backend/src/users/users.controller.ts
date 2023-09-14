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

  @Patch()
  @ApiCookieAuth('Authorization')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    return await this.usersService.updateById(id, updateUserDto);
  }

  @Delete()
  @ApiCookieAuth('Authorization')
  async remove(@Req() req) {
    const { id } = req.user;
    return await this.usersService.remove(id);
  }

  @Get('search-username/:name')
  @ApiCookieAuth('Authorization')
  async searchUsername(@Req() req, @Param('name') name: string) {
    const users = await this.usersService.findAllByUsernameLike(name);
    return users.map((u) => excludeUserFields(u, ['password', 'githubId']));
  }
}
