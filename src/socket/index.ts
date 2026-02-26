import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import env from '@/config/env.js';

import validateUserSocketHandShake from '@/middleware/auth/validateSocketHandShake.js';
import ioHandler from './ioHandler.js';

const pubClient = createClient({
  url: env.redis.url,
});

const subClient = pubClient.duplicate();

let socketIo: Server | null = null;


export async function initSocket (server: HttpServer) {

  await Promise.all([
    pubClient.connect(),
    subClient.connect(),
  ]);

  const io = new Server(server, {
    adapter: createAdapter(pubClient, subClient),
    transports: ['websocket'],
  });

  socketIo = io;

  io.use(validateUserSocketHandShake);
  ioHandler(io);

  return io;
}

const SocketService = {
  get io() { return socketIo; },

  init: initSocket,
};

export default SocketService;
