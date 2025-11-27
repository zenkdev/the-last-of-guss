import type { Request } from 'express';

export interface CurrentUser {
  id: number;
  username: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: CurrentUser;
  }
}

