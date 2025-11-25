import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TokenService } from './token.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async login(username: string, password: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      user = this.userRepository.create({ username, password, role: username });
      await this.userRepository.save(user);
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async loginWithToken(
    username: string,
    password: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const user = await this.login(username, password);
    return this.tokenService.issue(user);
  }

  validateToken(token: string): {
    userId: number;
    username: string;
    role: string;
    expiresAt: Date;
  } {
    const payload = this.tokenService.verify(token);
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      expiresAt: new Date(payload.exp * 1000),
    };
  }
}
