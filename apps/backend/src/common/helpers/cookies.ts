import { AUTH_COOKIE } from '../constants/contstants';
import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE);
};

export const parseCookies = (raw: string) => {
  const cookies = raw.split(';');
  const parsedCookies: { [key: string]: string } = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    parsedCookies[key.trim().toLowerCase()] = value;
  });

  return parsedCookies;
};
