import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

type CurrentUserResponse = {
  id: number;
  username: string;
  role: string;
};

@Controller('user')
export class UserController {
  constructor() {}

  @Get('current')
  @UseGuards(AuthGuard)
  currentUser(
    @Request() req: Request & { user: CurrentUserResponse },
  ): CurrentUserResponse {
    return req.user;
  }
}
