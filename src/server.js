const io = require('socket.io-client');
const ioClient = io('http://localhost:6000', {
  path: '/levelup-socket.io',
});
ioClient.connect();

ioClient.on('_game_event-hit', (message) => {
  console.info(message);
});
