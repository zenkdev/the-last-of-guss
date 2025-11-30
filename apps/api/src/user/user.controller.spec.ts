import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import type { CurrentUser } from '../auth/auth.types';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: (): boolean => true,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен вернуть текущего пользователя из запроса', () => {
    const mockUser: CurrentUser = {
      id: 1,
      username: 'testuser',
      role: 'user',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const result = controller.currentUser(mockRequest);

    expect(result).toEqual(mockUser);
    expect(result.id).toBe(1);
    expect(result.username).toBe('testuser');
    expect(result.role).toBe('user');
  });

  it('должен вернуть пользователя с ролью admin', () => {
    const mockUser: CurrentUser = {
      id: 2,
      username: 'admin',
      role: 'admin',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const result = controller.currentUser(mockRequest);

    expect(result).toEqual(mockUser);
    expect(result.role).toBe('admin');
  });

  it('должен вернуть пользователя с ролью nikita', () => {
    const mockUser: CurrentUser = {
      id: 3,
      username: 'Никита',
      role: 'nikita',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const result = controller.currentUser(mockRequest);

    expect(result).toEqual(mockUser);
    expect(result.role).toBe('nikita');
    expect(result.username).toBe('Никита');
  });
});
