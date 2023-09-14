import { ForbiddenException, Injectable } from '@nestjs/common';
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

    if (!user.password) {
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

  async verify(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);

    if (!decoded) {
      throw new ForbiddenException('Invalid token');
    }

    return this.usersService.findOneByUsername(decoded.username);
  }

  async github(githubUser: any): Promise<string> {
    return this.jwtService.sign({ id: githubUser.id });
  }
}
