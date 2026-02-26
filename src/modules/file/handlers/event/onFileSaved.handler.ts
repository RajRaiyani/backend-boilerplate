import ServerEvent from '@/service/event/index.js';
import { convertImageToWebp } from '@/modules/file/file.service.js';
import RegisterServerEventHandler from '@/core/registerServerEventHandler.js';
import type { EventContext } from '@/core/registerServerEventHandler.js';
import path from 'path';

const imageFileExtensions = ['.jpg', '.jpeg', '.png'];

export async function Handler(ctx: EventContext, file: { id: string; key: string; _status: string }) {

  const isImageToConvert = imageFileExtensions.includes(path.extname(file.key));
  if (isImageToConvert) await convertImageToWebp({ database: ctx.database }, { id: file.id });
}

ServerEvent.on('file:saved', RegisterServerEventHandler(Handler, { withDatabase: true }));
