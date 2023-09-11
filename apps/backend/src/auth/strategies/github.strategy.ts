import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['public_profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = this.usersService.findOneByGithubId(profile.id);

    if (user) {
      return user;
    }

    await this.usersService.create({
      githubId: profile.id,
      username: profile.username,
      avatar: profile.photos[0].value,
    });

    return user;
  }
}
