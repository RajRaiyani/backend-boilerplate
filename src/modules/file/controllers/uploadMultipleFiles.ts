import type { NextFunction, Request, Response } from 'express';
import type { DatabaseClient } from '@/service/database/index.js';
import { registerNewFile } from '@/modules/file/file.service.js';
import { HttpStatusCodes as StatusCodes } from '@/config/constant.js';


export async function Controller(req: Request, res: Response, next: NextFunction, db: DatabaseClient) {
  const files = req.files;

  if (!files || !Array.isArray(files) || files.length === 0) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Files are required' });

  const newFiles = await Promise.all(files.map(file => registerNewFile({ database: db }, { filePath: file.path })));

  return res.status(StatusCodes.OK).json(newFiles);
}
