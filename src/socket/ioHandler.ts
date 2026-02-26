import type { Server } from 'socket.io';
import Logger from '@/service/logger/index.js';


export default function ioHandler(io: Server) {


  io.on('error', (error) => {
    Logger.error(`Socket error: ${error}`);
  });

}
