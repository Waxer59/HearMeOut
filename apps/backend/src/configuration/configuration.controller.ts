import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @Req() req,
  ) {
    const { id } = req.user;

    return await this.configurationService.update(id, updateConfigurationDto);
  }
}
