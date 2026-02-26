import {
  registerNewFile as registerNewFileService,
  hardDeleteFile as hardDeleteFileService,
  updateFileStatus as updateFileStatusService,
  saveFile as saveFileService,
  deleteFile as deleteFileService,
} from './services/fileOperations.service.js';
import { convertImageToWebp as convertImageToWebpService } from './services/imageFile.service.js';

import RegisterService from '@/core/registerService.js';

export const registerNewFile = RegisterService(registerNewFileService);
export const hardDeleteFile = RegisterService(hardDeleteFileService);
export const convertImageToWebp = RegisterService(convertImageToWebpService);
export const updateFileStatus = RegisterService(updateFileStatusService);
export const saveFile = RegisterService(saveFileService);
export const deleteFile = RegisterService(deleteFileService);
