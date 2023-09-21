import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Configuration')
@UseGuards(AuthGuard('jwt'))
@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationService: ConfigurationsService) {}

  @Get()
  @ApiCookieAuth('Authorization')
  async findOne(@Req() req) {
    const { id } = req.user;
    return await this.configurationService.findByUserId(id);
  }

  @Patch()
  @ApiCookieAuth('Authorization')
  async update(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @Req() req,
  ) {
    const { id } = req.user;

    return await this.configurationService.update(id, updateConfigurationDto);
  }
}
