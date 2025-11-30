import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequestBody, LoginResponse } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestBody): Promise<LoginResponse> {
    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    return await this.authService.login(loginDto.username, loginDto.password);
  }
}
