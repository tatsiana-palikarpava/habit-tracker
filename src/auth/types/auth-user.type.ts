export type AuthUserType = {
  userId: number;
  name: string;
};

export type JwtTokenPayload = {
  sub: number;
  name: string;
  exp: number;
  iat: number;
};
