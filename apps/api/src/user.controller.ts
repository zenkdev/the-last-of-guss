import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('current')
  @UseGuards(AuthGuard)
  currentUser(@Request() req: ExpressRequest) {
    return req.user!;
  }
}
