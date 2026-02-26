import { Router } from 'express';
import withDatabase from '@/core/withDatabase.js';
import { Controller as uploadFile } from '@/modules/file/controllers/uploadFile.js';
import { Controller as uploadMultipleFiles } from '@/modules/file/controllers/uploadMultipleFiles.js';
import env from '@/config/env.js';
import express from 'express';
import fileUpload from '@/middleware/multer/fileUpload.js';

const router = Router();

router.route('/upload')
  .post(fileUpload.single('file'), withDatabase(uploadFile));

router.route('/upload-multiple')
  .post(fileUpload.array('files'), withDatabase(uploadMultipleFiles));

router.use('/', express.static(env.fileStoragePath));

export default router;
