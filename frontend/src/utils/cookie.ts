import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import jwt_encode from 'jwt-encode';

type ParsedCookie = {
  exp: number;
  iat: number;
  sub: number;
  twoFactorAuthenticatedEnabled: boolean;
};

export const parseJwtCookie = (token: string): ParsedCookie => {
  return jwt_decode(token);
};
