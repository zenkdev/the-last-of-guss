import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import type { CurrentUser } from '../auth/auth.types';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('должен быть определен', () => {
    expect(guard).toBeDefined();
  });

  it('должен разрешать доступ для пользователя с ролью admin', () => {
    const mockUser: CurrentUser = {
      id: 1,
      username: 'admin',
      role: 'admin',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('должен запрещать доступ для пользователя без роли admin', () => {
    const mockUser: CurrentUser = {
      id: 2,
      username: 'user',
      role: 'user',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow('Admin role required');
  });

  it('должен запрещать доступ для неаутентифицированного пользователя', () => {
    const mockRequest = {
      user: undefined,
    } as Request;

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
      'User not authenticated',
    );
  });

  it('должен запрещать доступ для пользователя с ролью "nikita"', () => {
    const mockUser: CurrentUser = {
      id: 3,
      username: 'Никита',
      role: 'nikita',
    };

    const mockRequest = {
      user: mockUser,
    } as Request;

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow('Admin role required');
  });
});
