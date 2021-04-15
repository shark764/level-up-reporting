import 'dotenv/config';
import { Server } from 'socket.io';
import { models } from '../models';
import pubsub, { EVENTS } from '../subscription';
import { getRoomByClientType, log, socketIOPath } from '../utils';
import { whiteList } from '../utils/consts';

import { sadd, smembers } from '../redis';

import * as IO_EVENTS from './events';

const domain = process.env.DOMAIN || 'localhost';
const port = process.env.SOCKET_IO_PORT || 8001;
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Restricting access to server using a whitelist
 */
const corsOptions = {
  origin: whiteList,
  optionsSuccessStatus: 200, // For legacy browser support
};

/**
 * Socket.io is attached to a new HTTP Server so it uses a different port
 * We need this since Apollo is already using HTTP Server previously configured.
 * Socket.IO then listen to a new HTTP Server with a different port.
 */
const ioServer = new Server(port, {
  path: socketIOPath,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    ...corsOptions,
    methods: ['GET', 'POST'],
    allowedHeaders: ['levelup-token-header'],
    credentials: true,
  },
});

log(
  'success',
  `\nSocket.IO Server accepting connections at port ${port} ....`,
  `\n\tSocket open at: http://${domain}:${port}${socketIOPath}`,
  `\n\tStarting timestamp: ${new Date()}`
);

ioServer.on('connection', (socket) => {
  log('info', `\nClient connected [id=${socket.id}]`);

  const { type } = socket.handshake.query;
  const room = getRoomByClientType(type);
  if (room) {
    socket.join(room);
    log('default', `Client joined room ${room} [id=${socket.id}]`);
  }

  /**
   * Handle when socket client sends data
   */
  socket.on('_game_running-test-data', (data, callback) => {
    console.log('_game_running-test-data', data);
    socket.emit('_game_event-hit', { data });
  });

  socket.on(IO_EVENTS.START_GAME, async (data, callback) => {
    if (!isProduction) {
      log('info', `\nMessage received from gateway`, data);
    }
    const { payload, ...metadata } = data;
    const { game, player } = payload;
    const newGame = await models.Game.create({ name: game.name });
    pubsub.publish(EVENTS.GAME.GAME_CREATED, newGame);
    const newPlayer = await models.Player.create({ name: player.name });
    pubsub.publish(EVENTS.PLAYER.PLAYER_CREATED, newPlayer);

    const result = { id: newGame._id, data: newGame };
    const response = {
      ...metadata,
      timestamp: new Date(),
      result,
    };

    socket.emit(IO_EVENTS.GAME_STARTED, response);
    ioServer.to('web-clients').emit(IO_EVENTS.GAME_STARTED, result);
  });

  socket.on(IO_EVENTS.TARGET_HIT, (data, callback) => {
    if (!isProduction) {
      log('info', `\nMessage received from gateway`, data);
    }
    const { payload, ...metadata } = data;
    const { hit } = payload;
    sadd(hit.gameId, JSON.stringify(hit));

    const result = { gameId: hit.gameId, data: hit };
    const response = {
      ...metadata,
      timestamp: new Date(),
      result,
    };

    socket.emit(IO_EVENTS.TARGET_HIT, response);
    ioServer.to('web-clients').emit(IO_EVENTS.TARGET_HIT, result);
  });

  socket.on(IO_EVENTS.FINISH_GAME, (data, callback) => {
    if (!isProduction) {
      log('info', `\nMessage received from gateway`, data);
    }

    const { payload, ...metadata } = data;
    const { gameId } = payload;
    smembers(gameId, (err, value) => {
      if (err) {
        log('error', err);
      }
      const hits = value
        .filter((hit) => hit.length > 0)
        .map((hit) => JSON.parse(hit));
      models.Hit.insertMany(hits)
        .then((docs) => {
          pubsub.publish(EVENTS.HIT.HIT_BATCH, docs);

          const result = { data: docs };
          const response = {
            ...metadata,
            timestamp: new Date(),
            result,
          };

          socket.emit(IO_EVENTS.GAME_FINISHED, response);
          ioServer.to('web-clients').emit(IO_EVENTS.GAME_FINISHED, result);
        })
        .catch((err) => {
          log('error', err);
        });
    });
  });

  socket.on('disconnecting', () => {
    log('default', `Client will be disconnect [id=${socket.id}]`);
  });

  /**
   * When socket disconnects, remove it from the list:
   */
  socket.on('disconnect', (reason) => {
    log('warning', `Client gone [id=${socket.id}]`, reason);
  });
});
