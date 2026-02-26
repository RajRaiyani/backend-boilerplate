import type { NextFunction, Request, Response } from 'express';
import type { DatabaseClient } from '@/service/database/index.js';
import { HttpStatusCodes as StatusCodes } from '@/config/constant.js';
import z from 'zod';
import RedisClient from '@/service/redis/index.js';
import { createJWTToken, decryptEncryptedToken } from '@/utility/token.js';
import bcrypt from 'bcryptjs';
import { TokenTypes } from '@/config/constant.js';

export const ValidationSchema = {
  body: z.object({
    token: z.string().trim().min(1).max(5000),
    otp: z.string().trim().min(1).max(255),
  }),
};


export async function Controller(req: Request, res: Response, next: NextFunction, db: DatabaseClient) {
  const { token, otp } = req.body as z.infer<typeof ValidationSchema.body>;

  const decryptedToken = await decryptEncryptedToken(token);
  if (!decryptedToken) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });

  const storedOtp = await RedisClient.get(token);
  if (!storedOtp) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid or expired token' });

  if (storedOtp !== otp) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP' });


  const { name, email, password } = decryptedToken as { name: string, email: string, password: string };

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await db.queryOne(`
    INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *
  `, [name, email, passwordHash]);

  const accessToken = await createJWTToken({ type: TokenTypes.USER_ACCESS_TOKEN, user_id: newUser.id }, '1h');

  return res.status(StatusCodes.OK).json({
    token: accessToken,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
}
