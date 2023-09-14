import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AUTH_COOKIE } from 'src/common/constants/contstants';
import { excludeUserFields } from 'src/common/helpers/excludeUserFields';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiProperty()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return excludeUserFields(user, ['password', 'githubId']);
  }

  @ApiProperty()
  @Post('sign-in')
  async signIn(@Body() sigInDto: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(sigInDto);

    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: true,
    });

    return res.status(HttpStatus.OK).json({
      message: 'Signed in successfully',
    });
  }

  @ApiProperty()
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('Authorization')
  @Get('sign-out')
  async signOut(@Res() res) {
    res.clearCookie(AUTH_COOKIE);

    return res.status(HttpStatus.OK).json({
      message: 'Signed out successfully',
    });
  }

  @ApiProperty()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // ...
  }

  @ApiExcludeEndpoint()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    const token = await this.authService.github(user);

    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: true,
    });

    return res.redirect(this.configService.get('FRONTEND_URL'));
  }

  @ApiProperty()
  @Get('/verify')
  @ApiCookieAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  async verify(@Req() req) {
    return excludeUserFields(req.user, ['password', 'githubId']);
  }
}
