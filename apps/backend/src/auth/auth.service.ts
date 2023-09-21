import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { compareHash } from 'src/common/helpers/bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.usersService.findOneByUsername(signInDto.username);

    if (!user?.password) {
      throw new ForbiddenException('Username or password is incorrect');
    }

    const isValidPassword = compareHash({
      raw: signInDto.password,
      hash: user.password,
    });

    if (!isValidPassword) {
      throw new ForbiddenException('Username or password is incorrect');
    }

    return this.jwtService.sign({ id: user.id });
  }

  async signUp(signUpDto: SignUpDto) {
    return await this.usersService.create(signUpDto);
  }

  async github(githubUser: any): Promise<string> {
    return this.jwtService.sign({ id: githubUser.id });
  }

  async verify(jwt: string): Promise<any> {
    let payload;

    try {
      payload = this.jwtService.verify(jwt);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
