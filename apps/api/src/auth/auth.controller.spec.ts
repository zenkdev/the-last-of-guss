import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(() => Promise.resolve({ access_token: 'test-token-123' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен успешно выполнить логин с валидными данными', async () => {
    const loginDto = {
      username: 'testuser',
      password: 'testpassword',
    };
    const expectedResponse = { access_token: 'test-token-123' };

    (authService.login as jest.Mock).mockResolvedValue(expectedResponse);

    const result = await controller.login(loginDto);

    expect(result).toEqual(expectedResponse);
    expect(authService.login).toHaveBeenCalledWith(
      loginDto.username,
      loginDto.password,
    );
  });

  it('должен выбросить ошибку при отсутствии username', async () => {
    const loginDto = {
      username: '',
      password: 'testpassword',
    };

    await expect(controller.login(loginDto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(controller.login(loginDto)).rejects.toThrow(
      'Username and password are required',
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('должен выбросить ошибку при отсутствии password', async () => {
    const loginDto = {
      username: 'testuser',
      password: '',
    };

    await expect(controller.login(loginDto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(controller.login(loginDto)).rejects.toThrow(
      'Username and password are required',
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('должен выбросить ошибку при отсутствии обоих полей', async () => {
    const loginDto = {
      username: '',
      password: '',
    };

    await expect(controller.login(loginDto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(controller.login(loginDto)).rejects.toThrow(
      'Username and password are required',
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('должен выбросить ошибку при неверных учетных данных', async () => {
    const loginDto = {
      username: 'testuser',
      password: 'wrongpassword',
    };

    (authService.login as jest.Mock).mockRejectedValue(
      new UnauthorizedException('Invalid username or password'),
    );

    await expect(controller.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(controller.login(loginDto)).rejects.toThrow(
      'Invalid username or password',
    );
    expect(authService.login).toHaveBeenCalledWith(
      loginDto.username,
      loginDto.password,
    );
  });

  it('должен обработать ошибку от authService', async () => {
    const loginDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    const error = new Error('Database connection failed');
    (authService.login as jest.Mock).mockRejectedValue(error);

    await expect(controller.login(loginDto)).rejects.toThrow(error);
    expect(authService.login).toHaveBeenCalledWith(
      loginDto.username,
      loginDto.password,
    );
  });
});
