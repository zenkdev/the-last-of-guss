export type LoginRequestBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};

export type CurrentUser = {
  id: number;
  username: string;
  role: string;
};
