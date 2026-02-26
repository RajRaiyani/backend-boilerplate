import Database from '@/service/database/index.js';
import { convertFileToWebp } from '@/modules/file/file.service.js';
import Logger from '@/service/logger/index.js';

export async function task() {

  const filesToConvert = await Database.queryAll(`
      SELECT
        id, key
      FROM files
      WHERE
        _status = 'saved' AND
        key NOT LIKE '%.webp' AND
        ( key LIKE '%.png' OR key LIKE '%.jpg' OR key LIKE '%.jpeg')
    `);

  console.log(filesToConvert);

  for (const file of filesToConvert) {
    await convertFileToWebp(file.id, { withDatabase: true });
    Logger.info(`Converted file: ${file.key}`);
  }

  return Logger.info('Process completed');
}

