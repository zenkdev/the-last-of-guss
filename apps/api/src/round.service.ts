import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { MoreThan, Repository } from 'typeorm';
import { RoundScore } from './round-score.entity';
import { Round } from './round.entity';
import { User } from './user.entity';

@Injectable()
export class RoundService {
  constructor(
    @Inject('ROUND_REPOSITORY')
    private roundRepository: Repository<Round>,
    @Inject('ROUND_SCORE_REPOSITORY')
    private roundScoreRepository: Repository<RoundScore>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Round[]> {
    return this.roundRepository.find({
      where: {
        endAt: MoreThan(moment().utc().toDate()),
      },
      order: { startAt: 'DESC' },
    });
  }

  async findOne(
    id: string,
    userId: number,
  ): Promise<
    Round & {
      myScore: number;
      winner?: string;
      winnerScore?: number;
    }
  > {
    const round = await this.roundRepository.findOne({
      where: { id },
      relations: ['scores'],
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    // Получить очки пользователя
    const userScore = round.scores.find((score) => score.userId === userId);
    const myScore = userScore?.score ?? 0;

    const result: Round & {
      myScore: number;
      winner?: string;
      winnerScore?: number;
    } = { ...round, myScore };

    // Получить победителя и общие очки, если раунд завершен
    const isCompleted = moment(round.endAt).isBefore(moment().utc());
    if (isCompleted) {
      // Получить победителя
      const winnerScore = round.scores.sort((a, b) => b.score - a.score).at(0);

      if (winnerScore) {
        result.winnerScore = winnerScore.score;
        const winnerUser = await this.userRepository.findOne({
          where: { id: winnerScore.userId },
        });
        result.winner = winnerUser?.username;
      }
    }

    // Удалить связь scores из результата, чтобы избежать циклической ссылки
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete (result as any).scores;

    return result;
  }

  async create(): Promise<Round> {
    const utcNow = moment().utc();
    const cooldownDuration = Number(process.env.COOLDOWN_DURATION || 30);
    const startAt = moment(utcNow).add(cooldownDuration, 'seconds');
    const roundDuration = Number(process.env.ROUND_DURATION || 60);
    const endAt = moment(startAt).add(roundDuration, 'seconds');

    const round = this.roundRepository.create({
      startAt: startAt.toDate(),
      endAt: endAt.toDate(),
    });

    return this.roundRepository.save(round);
  }

  async tapGoose(
    roundId: string,
    userId: number,
    username: string,
  ): Promise<{ score: number }> {
    const round = await this.roundRepository.findOne({
      where: { id: roundId },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${roundId} not found`);
    }

    const isStarted = moment(round.startAt).isBefore(moment().utc());
    if (!isStarted) {
      throw new BadRequestException('Round is not started');
    }

    // Найти или создать очки пользователя для этого раунда
    let userScore = await this.roundScoreRepository.findOne({
      where: { roundId, userId },
    });

    const oldScore = userScore?.score ?? 0;

    if (!userScore) {
      userScore = this.roundScoreRepository.create({
        roundId,
        userId,
        taps: 1,
        score: 1,
      });
    } else {
      userScore.taps += 1;
      // 1 тап = 1 очко, каждый одиннадцатый тап дает 10 очков
      userScore.score += userScore.taps % 11 === 0 ? 10 : 1;
    }

    await this.roundScoreRepository.save(userScore);

    // Обновить общий счет раунда (пропустить для username "Никита")
    if (username !== 'Никита') {
      const scoreDifference = userScore.score - oldScore;
      if (scoreDifference !== 0) {
        await this.roundRepository.increment(
          { id: roundId },
          'totalScore',
          scoreDifference,
        );
      }
    }

    return { score: userScore.score };
  }
}
