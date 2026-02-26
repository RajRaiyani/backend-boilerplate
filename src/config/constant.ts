import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import errorCodes from './errorCode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const temporaryFileStoragePath = path.join(__dirname, '../../tmp');

if (!fs.existsSync(temporaryFileStoragePath))
  fs.mkdirSync(temporaryFileStoragePath);


export enum HttpStatusCodes {
  OK = 200,
  OK_WITHOUT_CONTENT = 204,
  BAD_REQUEST = 400,
  ALREADY_EXISTS = 409,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export enum TokenTypes {
  USER_ACCESS_TOKEN = 'user_access_token',
  USER_REGISTRATION_TOKEN = 'user_registration_token',
}

export { errorCodes as ErrorCodes };


export default {
  temporaryFileStoragePath,

  user: {
    token: {
      expiryInSeconds: 86400,
    },
  },
};
