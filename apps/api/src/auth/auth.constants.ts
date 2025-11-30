export const authConstants = {
  secret: process.env.AUTH_TOKEN_SECRET ?? 'dev-auth-secret',
  expiresIn: process.env.AUTH_TOKEN_TTL ?? '60m',
};
