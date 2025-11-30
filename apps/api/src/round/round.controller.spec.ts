import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import moment from 'moment';
import { AdminGuard } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import type { CurrentUser } from '../auth/auth.types';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import type { RoundDto, ScoreDto } from './round.types';

import type { Request as ExpressRequest } from 'express';

type AuthenticatedRequest = ExpressRequest & { user: CurrentUser };

describe('RoundController', () => {
  let controller: RoundController;
  let roundService: RoundService;

  const mockUser: CurrentUser = {
    id: 1,
    username: 'testuser',
    role: 'user',
  };

  const mockRequest = {
    user: mockUser,
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const mockRoundService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      tapGoose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoundController],
      providers: [
        {
          provide: RoundService,
          useValue: mockRoundService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (): boolean => true,
      })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: (): boolean => true,
      })
      .compile();

    controller = module.get<RoundController>(RoundController);
    roundService = module.get<RoundService>(RoundService);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('должен вернуть список активных раундов', async () => {
      const mockRounds = [
        {
          id: '1',
          startAt: new Date(),
          endAt: new Date(Date.now() + 60000),
          totalScore: 0,
        },
        {
          id: '2',
          startAt: new Date(),
          endAt: new Date(Date.now() + 120000),
          totalScore: 0,
        },
      ];

      (roundService.findAll as jest.Mock).mockResolvedValue(mockRounds);

      const result = await controller.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('startAt');
      expect(result[0]).toHaveProperty('endAt');
      expect(result[0].startAt).toBe(mockRounds[0].startAt.toISOString());
      expect(result[0].endAt).toBe(mockRounds[0].endAt.toISOString());
      expect(roundService.findAll).toHaveBeenCalled();
    });

    it('должен вернуть пустой массив, если нет активных раундов', async () => {
      (roundService.findAll as jest.Mock).mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(roundService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('должен создать новый раунд', async () => {
      const mockRound = {
        id: 'new-round-id',
        startAt: new Date(),
        endAt: new Date(Date.now() + 60000),
        totalScore: 0,
      };

      (roundService.create as jest.Mock).mockResolvedValue(mockRound);

      const result = await controller.create();

      expect(result).toHaveProperty('id', 'new-round-id');
      expect(result).toHaveProperty('startAt');
      expect(result).toHaveProperty('endAt');
      expect(result.startAt).toBe(mockRound.startAt.toISOString());
      expect(result.endAt).toBe(mockRound.endAt.toISOString());
      expect(roundService.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть детали раунда со статусом active', async () => {
      const roundId = 'test-round-id';
      const pastStartDate = moment().utc().subtract(30, 'minutes').toDate();
      const futureEndDate = moment().utc().add(1, 'hour').toDate();

      const mockRound: RoundDto = {
        id: roundId,
        startAt: pastStartDate,
        endAt: futureEndDate,
        totalScore: 100,
        myScore: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        scores: [],
      };

      (roundService.findOne as jest.Mock).mockResolvedValue(mockRound);

      const result = await controller.findOne(roundId, mockRequest);

      expect(result.id).toBe(roundId);
      expect(result.status).toBe('active');
      expect(result.totalScore).toBe(100);
      expect(result.myScore).toBe(50);
      expect(roundService.findOne).toHaveBeenCalledWith(roundId, mockUser.id);
    });

    it('должен вернуть детали раунда со статусом completed', async () => {
      const roundId = 'test-round-id';
      const pastDate = moment().utc().subtract(1, 'hour').toDate();

      const mockRound: RoundDto = {
        id: roundId,
        startAt: pastDate,
        endAt: pastDate,
        totalScore: 200,
        myScore: 100,
        winner: 'winneruser',
        winnerScore: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
        scores: [],
      };

      (roundService.findOne as jest.Mock).mockResolvedValue(mockRound);

      const result = await controller.findOne(roundId, mockRequest);

      expect(result.id).toBe(roundId);
      expect(result.status).toBe('completed');
      expect(result.totalScore).toBe(200);
      expect(result.myScore).toBe(100);
      expect(result.winner).toBe('winneruser');
      expect(result.winnerScore).toBe(150);
    });

    it('должен выбросить ошибку, если раунд не найден', async () => {
      const roundId = 'non-existent-id';

      (roundService.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Round with ID ${roundId} not found`),
      );

      await expect(controller.findOne(roundId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(roundService.findOne).toHaveBeenCalledWith(roundId, mockUser.id);
    });
  });

  describe('tapGoose', () => {
    it('должен успешно выполнить тап и вернуть новый счет', async () => {
      const roundId = 'test-round-id';
      const mockScore: ScoreDto = { score: 5 };

      (roundService.tapGoose as jest.Mock).mockResolvedValue(mockScore);

      const result = await controller.tapGoose(roundId, mockRequest);

      expect(result).toEqual(mockScore);
      expect(result.score).toBe(5);
      expect(roundService.tapGoose).toHaveBeenCalledWith(
        roundId,
        mockUser.id,
        mockUser.username,
      );
    });

    it('должен выбросить ошибку, если раунд не найден', async () => {
      const roundId = 'non-existent-id';

      (roundService.tapGoose as jest.Mock).mockRejectedValue(
        new NotFoundException(`Round with ID ${roundId} not found`),
      );

      await expect(controller.tapGoose(roundId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('должен выбросить ошибку, если раунд еще не начался', async () => {
      const roundId = 'test-round-id';

      (roundService.tapGoose as jest.Mock).mockRejectedValue(
        new BadRequestException('Round is not started'),
      );

      await expect(controller.tapGoose(roundId, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.tapGoose(roundId, mockRequest)).rejects.toThrow(
        'Round is not started',
      );
    });

    it('должен передать username пользователя в tapGoose', async () => {
      const roundId = 'test-round-id';
      const mockScore: ScoreDto = { score: 10 };
      const customUser: CurrentUser = {
        id: 2,
        username: 'Никита',
        role: 'nikita',
      };
      const customRequest = { user: customUser } as AuthenticatedRequest;

      (roundService.tapGoose as jest.Mock).mockResolvedValue(mockScore);

      await controller.tapGoose(roundId, customRequest);

      expect(roundService.tapGoose).toHaveBeenCalledWith(
        roundId,
        customUser.id,
        'Никита',
      );
    });
  });
});
