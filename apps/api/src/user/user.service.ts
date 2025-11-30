import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  private getRoleFromUsername(username: string): string {
    // Если username - admin, роль admin
    if (username === 'admin') {
      return 'admin';
    }

    // Если username - Никита, роль nikita
    if (username === 'Никита') {
      return 'nikita';
    }

    // Все остальные получают роль user
    return 'user';
  }

  async login(username: string, password: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      user = this.userRepository.create({
        username,
        password,
        role: this.getRoleFromUsername(username),
      });
      await this.userRepository.save(user);
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
