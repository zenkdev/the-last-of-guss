import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoundScore } from './round-score.entity';
import { Round } from './round.entity';

@Injectable()
export class RoundService {
  constructor(
    @Inject('ROUND_REPOSITORY')
    private roundRepository: Repository<Round>,
    @Inject('ROUND_SCORE_REPOSITORY')
    private roundScoreRepository: Repository<RoundScore>,
  ) {}

  async findAll(): Promise<Round[]> {
    return this.roundRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['scores'],
    });
  }

  async findOne(
    id: string,
    userId?: number,
  ): Promise<Round & { myScore?: number; winner?: string }> {
    const round = await this.roundRepository.findOne({
      where: { id },
      relations: ['scores'],
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    const result: Round & { myScore?: number; winner?: string } = { ...round };

    // Get user's score if userId provided
    if (userId) {
      const userScore = await this.roundScoreRepository.findOne({
        where: { roundId: id, userId },
      });
      result.myScore = userScore?.score ?? 0;
    }

    // Get winner if round is completed
    if (round.status === 'completed') {
      const scores = await this.roundScoreRepository.find({
        where: { roundId: id },
        order: { score: 'DESC' },
        take: 1,
      });

      if (scores.length > 0 && scores[0].score > 0) {
        // In a real app, you'd join with User table to get username
        // For now, we'll return userId as winner
        result.winner = `User ${scores[0].userId}`;
      }
    }

    // Remove scores relation from result to avoid circular reference
    delete (result as any).scores;

    return result;
  }

  async create(): Promise<Round> {
    const round = this.roundRepository.create({ status: 'pending' });

    return this.roundRepository.save(round);
  }

  async tapGoose(roundId: string, userId: number): Promise<{ score: number }> {
    const round = await this.roundRepository.findOne({
      where: { id: roundId },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${roundId} not found`);
    }

    if (round.status !== 'active') {
      throw new BadRequestException('Round is not active');
    }

    // Find or create user's score for this round
    let userScore = await this.roundScoreRepository.findOne({
      where: { roundId, userId },
    });

    if (!userScore) {
      userScore = this.roundScoreRepository.create({
        roundId,
        userId,
        score: 0,
      });
    }

    // Increment score (each goose tap gives 1 point)
    userScore.score += 1;
    await this.roundScoreRepository.save(userScore);

    return { score: userScore.score };
  }
}
