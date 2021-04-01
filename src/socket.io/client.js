import 'dotenv/config';
import io from 'socket.io-client';

const port = process.env.SOCKET_IO_PORT || 8001;
const isProduction = process.env.NODE_ENV === 'production';

const ioClient = io(`http://localhost:${port}`, {
  path: '/levelup-socket.io',
  reconnectionDelayMax: 10000,
});
ioClient.connect();

ioClient.on('connect', () => {
  console.log(
    '\x1b[33m%s\x1b[0m',
    `\nSocket.IO Client active and listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
  console.log(
    '\x1b[35m%s\x1b[0m',
    `\tClient receiving messages from: http://localhost:${port}/graphql`
  );
});

ioClient.on('_game_event-hit', (message) => {
  if (!isProduction) {
    console.log('\x1b[33m%s\x1b[0m', `\nMessage received from server`, message);
  }
});
