import {
  Controller,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { excludeUserFields } from 'src/common/helpers/excludeUserFields';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/helpers/fileFilter';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@ApiCookieAuth('Authorization')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return excludeUserFields(user, ['password', 'githubId']);
  }

  @Patch('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
    }),
  )
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const { id } = req.user;

    return await this.usersService.updateById(id, updateUserDto, avatar);
  }

  @Delete('active-conversations/:id')
  async removeActiveConversations(@Req() req, @Param('id') id: string) {
    const { id: userId } = req.user;
    return await this.usersService.removeActiveConversation(userId, id);
  }

  @Patch('active-conversations/:id')
  async addActiveConversations(@Req() req, @Param('id') id: string) {
    const { id: userId } = req.user;
    return await this.usersService.addActiveConversation(userId, id);
  }

  @Get('search-username/:name')
  async searchUsername(@Req() req, @Param('name') name: string) {
    const { id: userId } = req.user;
    const users = await this.usersService.findAllByUsernamesLike(userId, name);
    return users;
  }
}
