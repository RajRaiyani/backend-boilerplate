import type { NextFunction, Request, Response } from 'express';
import type { DatabaseClient } from '@/service/database/index.js';
import { registerNewFile } from '@/modules/file/file.service.js';
import { HttpStatusCodes as StatusCodes } from '@/config/constant.js';


export async function Controller(req: Request, res: Response, next: NextFunction, db: DatabaseClient) {
  const file = req.file;

  if (!file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'File is required' });

  const newFile = await registerNewFile({ database: db }, { filePath: file.path });

  return res.status(StatusCodes.OK).json(newFile);
}
