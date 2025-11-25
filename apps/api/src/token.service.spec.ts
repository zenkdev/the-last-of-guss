import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { User } from './user.entity';

describe('TokenService', () => {
  const buildUser = (): User =>
    ({
      id: 1,
      username: 'tester',
      password: 'secret',
      role: 'admin',
    }) as User;

  beforeEach(() => {
    process.env.AUTH_TOKEN_SECRET = 'unit-test-secret';
    process.env.AUTH_TOKEN_TTL = '3600';
  });

  afterEach(() => {
    delete process.env.AUTH_TOKEN_SECRET;
    delete process.env.AUTH_TOKEN_TTL;
  });

  it('issues tokens that can be verified', () => {
    const service = new TokenService();
    const { token, expiresAt } = service.issue(buildUser());

    expect(typeof token).toBe('string');
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());

    const payload = service.verify(token);
    expect(payload.username).toBe('tester');
    expect(payload.role).toBe('admin');
  });

  it('throws when token is expired', () => {
    process.env.AUTH_TOKEN_TTL = '-1';
    const service = new TokenService();
    const { token } = service.issue(buildUser());

    expect(() => service.verify(token)).toThrow(UnauthorizedException);
  });
});
