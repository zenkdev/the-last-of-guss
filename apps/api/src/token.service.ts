import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { User } from './user.entity';

type TokenPayload = {
  sub: number;
  username: string;
  role: string;
  exp: number;
  jti: string;
};

@Injectable()
export class TokenService {
  private readonly secret = process.env.AUTH_TOKEN_SECRET ?? 'dev-auth-secret';
  private readonly ttlSeconds = Number(process.env.AUTH_TOKEN_TTL ?? 60 * 60);

  issue(user: User): { token: string; expiresAt: Date } {
    const exp = Math.floor(Date.now() / 1000) + this.ttlSeconds;
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      exp,
      jti: randomUUID(),
    };
    const serializedPayload = Buffer.from(
      JSON.stringify(payload),
      'utf8',
    ).toString('base64url');
    const signature = this.sign(serializedPayload);

    return {
      token: `${serializedPayload}.${signature}`,
      expiresAt: new Date(exp * 1000),
    };
  }

  verify(token: string): TokenPayload {
    const [encodedPayload, providedSignature] = token.split('.');

    if (!encodedPayload || !providedSignature) {
      throw new UnauthorizedException('Invalid token format');
    }

    const expectedSignature = this.sign(encodedPayload);
    this.assertSameSignature(providedSignature, expectedSignature);

    let payload: TokenPayload;
    try {
      const payloadBuffer = Buffer.from(encodedPayload, 'base64url');
      const parsedValue = JSON.parse(payloadBuffer.toString('utf8')) as unknown;
      if (!this.isTokenPayload(parsedValue)) {
        throw new UnauthorizedException('Invalid token payload');
      }
      payload = parsedValue;
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.exp * 1000 <= Date.now()) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  private sign(encodedPayload: string): string {
    return createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('base64url');
  }

  private assertSameSignature(provided: string, expected: string): void {
    const providedBuffer = Buffer.from(provided, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');

    if (providedBuffer.length !== expectedBuffer.length) {
      throw new UnauthorizedException('Invalid token signature');
    }

    if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
      throw new UnauthorizedException('Invalid token signature');
    }
  }

  private isTokenPayload(value: unknown): value is TokenPayload {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    const candidate = value as Partial<TokenPayload>;
    return (
      typeof candidate.sub === 'number' &&
      typeof candidate.username === 'string' &&
      typeof candidate.role === 'string' &&
      typeof candidate.exp === 'number' &&
      typeof candidate.jti === 'string'
    );
  }
}
