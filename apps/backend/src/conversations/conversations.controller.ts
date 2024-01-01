import {
  Controller,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/helpers/fileFilter';
import { base64File } from 'src/common/helpers/base64File';

@ApiTags('Conversations')
@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Patch('update-icon/:id')
  @ApiCookieAuth('Authorization')
  @UseInterceptors(
    FileInterceptor('icon', {
      fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
    }),
  )
  async updateIcon(
    @UploadedFile() icon: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const base64Icon = base64File(icon);
    return await this.conversationsService.updateIcon(id, base64Icon);
  }
}
