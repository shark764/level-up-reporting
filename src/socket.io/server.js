const { Server } = require('socket.io');
import 'dotenv/config';

const { generateHit } = require('./utils');

const SocketIOServer = new Server(6000, {
  path: '/levelup-socket.io',
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

const connectedSocketClients = new Map();

SocketIOServer.on('connection', (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  connectedSocketClients.set(socket.id, socket);

  // when socket disconnects, remove it from the list:
  socket.on('disconnect', () => {
    connectedSocketClients.delete(socket.id);
    console.info(`Client gone [id=${socket.id}]`);
  });
});

setInterval(() => {
  for (const [id, client] of connectedSocketClients.entries()) {
    console.log({ id });
    const hit = generateHit(id);
    client.emit('_game_event-hit', { client: id, hit });
  }
}, 5000);