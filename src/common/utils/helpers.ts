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
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'none' as const,
    secure: true,
    maxAge: maxAge * 1000,
    path: '/',
  };

  res.cookie(name, value, cookieOptions);
}
