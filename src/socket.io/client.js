import 'dotenv/config';
import io from 'socket.io-client';
import { models } from '../models';
import { EVENTS } from '../subscription';

import pubsub from '../subscription';
import { log } from '../utils';

const port = process.env.SOCKET_IO_PORT || 8001;
const isProduction = process.env.NODE_ENV === 'production';

const ioClient = io(`http://localhost:${port}`, {
  path: '/levelup-socket.io',
  reconnectionDelayMax: 10000,
  withCredentials: true,
  extraHeaders: {
    'levelup-token-header':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
});
ioClient.connect();

ioClient.on('connect', () => {
  log(
    'success',
    `\nSocket.IO Client active and listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
  log(
    'info',
    `\tClient receiving messages from: http://localhost:${port}/graphql`
  );
});

ioClient.on('_game_event-start', async (message) => {
  if (!isProduction) {
    log('info', `\nMessage received from server`, message);
  }
  const { game, player } = message;
  const newGame = await models.Game.create({ name: game.name });
  pubsub.publish(EVENTS.GAME.GAME_CREATED, newGame);
  const newPlayer = await models.Player.create({ name: player.name });
  pubsub.publish(EVENTS.PLAYER.PLAYER_CREATED, newPlayer);
});

ioClient.on('_game_event-hit', (message) => {
  if (!isProduction) {
    log('info', `\nMessage received from server`, message);
  }
});

ioClient.on('_game_event-end', (message) => {
  if (!isProduction) {
    log('info', `\nMessage received from server`, message);
  }
  const hits = [];
  models.Hit.insertMany(hits)
    .then(function(docs) {
      // response.json(docs);
    })
    .catch(function(err) {
      // response.status(500).send(err);
    });
});
