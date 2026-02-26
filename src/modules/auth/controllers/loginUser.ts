import type { NextFunction, Request, Response } from 'express';
import type { DatabaseClient } from '@/service/database/index.js';
import { HttpStatusCodes as StatusCodes, TokenTypes } from '@/config/constant.js';
import z from 'zod';
import bcrypt from 'bcryptjs';
import { createJWTToken } from '@/utility/token.js';

export const ValidationSchema = {
  body: z.object({
    email: z.string().trim().min(1).max(255),
    password: z.string().trim().min(5).max(255),
  }),
};

export async function Controller(req: Request, res: Response, next: NextFunction, db: DatabaseClient) {
  const { email, password } = req.body as z.infer<typeof ValidationSchema.body>;

  const user = await db.queryOne('SELECT * FROM users WHERE email = $1', [email]);
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid email or password' });

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid email or password' });

  const accessToken = await createJWTToken({ type: TokenTypes.USER_ACCESS_TOKEN, user_id: user.id }, '24h');

  return res.status(StatusCodes.OK).json({
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
