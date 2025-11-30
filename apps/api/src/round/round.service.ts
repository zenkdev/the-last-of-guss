import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { MoreThan, Repository, type DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { RoundScore } from './round-score.entity';
import { Round } from './round.entity';
import type { RoundDto, ScoreDto } from './round.types';

@Injectable()
export class RoundService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    @Inject('ROUND_REPOSITORY')
    private roundRepository: Repository<Round>,
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

  async findOne(id: string, userId: number): Promise<RoundDto> {
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

    const result: RoundDto = { ...round, myScore };

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
  ): Promise<ScoreDto> {
    return await this.dataSource.transaction(async (manager) => {
      const roundRepository = manager.getRepository(Round);
      const roundScoreRepository = manager.getRepository(RoundScore);

      const round = await roundRepository.findOne({
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
      let userScore = await roundScoreRepository.findOne({
        where: { roundId, userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!userScore) {
        userScore = roundScoreRepository.create({
          roundId,
          userId,
          taps: 0,
          score: 0,
        });
      }

      userScore.taps += 1;
      // 1 тап = 1 очко, каждый одиннадцатый тап дает 10 очков
      const scoreIncrement = userScore.taps % 11 === 0 ? 10 : 1;
      userScore.score += scoreIncrement;

      await roundScoreRepository.save(userScore);

      // Обновить общий счет раунда (пропустить для username "Никита")
      if (username !== 'Никита') {
        await roundRepository.increment(
          { id: roundId },
          'totalScore',
          scoreIncrement,
        );
      }

      return { score: userScore.score };
    });
  }
}
