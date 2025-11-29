import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './roles.guard';
import { RoundService } from './round.service';
import type { CurrentUser } from './types/express';

type AuthenticatedRequest = ExpressRequest & { user: CurrentUser };

@Controller('rounds')
@UseGuards(AuthGuard)
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get()
  async findAll() {
    const rounds = await this.roundService.findAll();
    return rounds.map((round) => ({
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
    }));
  }

  @Post()
  @UseGuards(AdminGuard)
  async create() {
    const round = await this.roundService.create();
    return {
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const round = await this.roundService.findOne(id, req.user.id);
    return {
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      totalScore: round.totalScore,
      myScore: round.myScore,
      winner: round.winner,
      winnerScore: round.winnerScore,
    };
  }

  @Post(':id/tap')
  async tapGoose(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roundService.tapGoose(id, req.user.id, req.user.username);
  }
}
