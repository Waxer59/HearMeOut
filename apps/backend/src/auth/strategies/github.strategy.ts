import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { excludeUserFields } from 'src/common/helpers/excludeUserFields';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: `${configService.get('API_URL')}/api/auth/github/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    let user = await this.usersService.findOneByGithubId(profile.id);

    if (user) {
      return excludeUserFields(user, ['password', 'githubId']);
    }

    const alreadyExistsUsername = await this.usersService.findOneByUsername(
      profile.username,
    );

    if (alreadyExistsUsername) {
      profile.username = await this.usersService.generateUniqueUsername(
        profile.username,
      );
    }

    user = await this.usersService.create({
      githubId: profile.id,
      username: profile.username,
      avatar: profile.photos[0].value,
    });

    return done(null, excludeUserFields(user, ['password', 'githubId']));
  }
}
