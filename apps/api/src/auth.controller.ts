import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginDto = {
  username: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    return this.authService.login(loginDto.username, loginDto.password);
  }
}
