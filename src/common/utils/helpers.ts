import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}

/**
 * @param res - Express response object
 * @param token - Access token string
 * @param refreshToken - Refresh token string
 * @param tokenExpires - Expiration time in seconds (default: 3600)
 */
export function setCookies(
  res: Response,
  name: string,
  value: string,
  maxAge: number = 3600,
): void {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie(name, value, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: maxAge * 1000,
    path: '/',
  });
}

/**
 * @param res - Express response object
 * @param name - Cookie name to clear
 */
export function clearCookie(res: Response, name: string): void {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie(name, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  });
}
