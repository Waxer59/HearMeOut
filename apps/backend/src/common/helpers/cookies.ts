import { AUTH_COOKIE, AUTH_COOKIE_EXPIRATION } from '../constants/constants';
import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + AUTH_COOKIE_EXPIRATION),
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE);
};

export const parseCookies = (raw: string): { [key: string]: string } | null => {
  if (!raw) {
    return null;
  }

  const cookies = raw.split(';');
  const parsedCookies: { [key: string]: string } = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    parsedCookies[key.trim().toLowerCase()] = value;
  });

  return parsedCookies;
};
