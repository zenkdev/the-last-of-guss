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
import moment from 'moment';
import { AdminGuard } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import type { CurrentUser } from '../auth/auth.types';
import { RoundService } from './round.service';

type AuthenticatedRequest = ExpressRequest & { user: CurrentUser };

@Controller('rounds')
@UseGuards(AuthGuard)
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  private getRoundStatus(
    startAt: Date,
    endAt: Date,
  ): 'completed' | 'active' | 'cooldown' {
    const utcNow = moment().utc();
    if (moment(endAt).isBefore(utcNow)) {
      return 'completed';
    }
    if (moment(startAt).isBefore(utcNow)) {
      return 'active';
    }
    return 'cooldown';
  }

  @Get()
  async findAll() {
    const rounds = await this.roundService.findAll();
    return rounds.map((round) => ({
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      status: this.getRoundStatus(round.startAt, round.endAt),
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
      status: this.getRoundStatus(round.startAt, round.endAt),
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
      status: this.getRoundStatus(round.startAt, round.endAt),
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
