import 'dotenv/config';
/**
 * TODO:
 * Fix models
 */
// import { models } from '../../models/schemas';
import pubsub, { EVENTS } from '../../subscription';
import { getRoomByClientType, log } from '../../utils';

import { sadd, smembers } from '../../redis';

import { EVENTS as IO_EVENTS } from './events';

const port = process.env.PORT || 3009;
const isDevEnvironment = process.env.NODE_ENV === 'development';

/**
 * Socket.io is attached to a new HTTP Server so it uses a different port
 * We need this since Apollo is already using HTTP Server previously configured.
 * Socket.IO then listen to a new HTTP Server with a different port.
 *
 * UPDATE:
 * Temporarily http and socket use same port
 */
const run = (socketServer) => {
  if (isDevEnvironment) {
    log(
      'success',
      `Socket.io Server accepting connections at [port=${port}] [starting timestamp=${new Date()}]`
    );
  }

  socketServer.on('connection', (socket) => {
    if (isDevEnvironment) {
      log('info', `\nClient connected [id=${socket.id}]`);
    }

    const { type } = socket.handshake.query;
    const room = getRoomByClientType(type);
    if (room) {
      socket.join(room);
      if (isDevEnvironment) {
        log('default', `Client joined room ${room} [id=${socket.id}]`);
      }
    }

    /**
     * Sender Client App
     *  UI-Clients: Web / Mobile / Test UI
     */
    // Get the game server status.
    socket.on(IO_EVENTS.UI_CLIENT.REQUEST_SERVER_STATUS, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.REQUEST_SERVER_STATUS}`
        );
      }

      socket.emit(IO_EVENTS.UI_CLIENT.REQUEST_SERVER_STATUS_SUCCEEDED, data);
    });

    // Get the game server log.
    socket.on(IO_EVENTS.UI_CLIENT.REQUEST_SERVER_LOG, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.REQUEST_SERVER_LOG}`
        );
      }

      socket.emit(IO_EVENTS.UI_CLIENT.REQUEST_SERVER_LOG_SUCCEEDED, data);
    });

    // Get information on all registered devices.
    socket.on(IO_EVENTS.UI_CLIENT.REQUEST_REGISTERED_DEVICES, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.REQUEST_REGISTERED_DEVICES}`
        );
      }

      socket.emit(
        IO_EVENTS.UI_CLIENT.REQUEST_REGISTERED_DEVICES_SUCCEEDED,
        data
      );
    });

    // Set/reset all device states to prep for the next game.
    socket.on(IO_EVENTS.UI_CLIENT.SET_STATE, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.SET_STATE}`
        );
      }
      try {
        socket.emit(IO_EVENTS.UI_CLIENT.SET_STATE_SUCCEEDED, data);
      } catch (error) {
        socket.emit(IO_EVENTS.UI_CLIENT.SET_STATE_FAILED, data);
      }
    });

    // Start a game session by sending a game context. See section 1.1.1.
    // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE, TARGET_UPDATE,
    // TARGET_HIT events.
    socket.on(IO_EVENTS.UI_CLIENT.START_GAME, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.START_GAME}`
        );
      }
      try {
        // socketServer
        //   .to('gateway-servers')
        //   .emit(IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE, data);
        // socketServer
        //   .to('gateway-servers')
        //   .emit(IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE, data);
        // socketServer
        //   .to('gateway-servers')
        //   .emit(IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT, data);
        socket.emit(IO_EVENTS.UI_CLIENT.START_GAME_SUCCEEDED, data);
      } catch (error) {
        if (isDevEnvironment) {
          log('error', error);
        }
        socket.emit(IO_EVENTS.UI_CLIENT.START_GAME_FAILED, data);
      }
    });

    // End a game session by cancelling it.
    socket.on(IO_EVENTS.UI_CLIENT.END_GAME, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.END_GAME}`
        );
      }
      try {
        socket.emit(IO_EVENTS.UI_CLIENT.END_GAME_SUCCEEDED, data);
      } catch (error) {
        socket.emit(IO_EVENTS.UI_CLIENT.END_GAME_FAILED, data);
      }
    });

    /**
     * 1.3 - WebSocket Service Commands
     * Sender Client App
     *  UI-Clients: Web / Mobile / Test UI
     */
    socket.on(IO_EVENTS.UI_CLIENT.WS_POST_COMMAND, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.UI_CLIENT.WS_POST_COMMAND} [type=${data.eventType}]`
        );
      }

      try {
        const { eventType } = data;
        switch (eventType) {
          case 'RESET_DATA':
            // Delete all device and event log data in the server database.

            break;
          case 'CLEAR_LOG':
            // Clear the event log in the server database.

            break;
          case 'PING':
            // Send a GET /status to a registered device to get latest context.
            // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE event.
            socketServer
              .to('gateway-servers')
              .emit(IO_EVENTS.GATEWAY_CLIENT.PING, data);

            break;
          case 'PING_ALL':
            // Send a GET /status to all registered devices to get all context updates.
            // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE event.
            socketServer
              .to('gateway-servers')
              .emit(IO_EVENTS.GATEWAY_CLIENT.PING_ALL, data);

            break;
          case 'SET_DEVICE_CONFIG':
            // Send a POST /config to a registered device to set configuration.
            // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE event.
            socketServer
              .to('gateway-servers')
              .emit(IO_EVENTS.GATEWAY_CLIENT.SET_DEVICE_CONFIG, data);

            break;
          case 'SET_DEVICE_MODE':
            // Send a POST /mode to a registered device to set game mode.
            // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE event.
            socketServer
              .to('gateway-servers')
              .emit(IO_EVENTS.GATEWAY_CLIENT.SET_DEVICE_MODE, data);

            break;
          case 'START_DEVICE':
            // Send a POST /start to a registered device to start game.
            // Server WebSocket asynchronously emits DEVICES_CONTEXT_UPDATE event.
            socketServer
              .to('gateway-servers')
              .emit(IO_EVENTS.GATEWAY_CLIENT.START_DEVICE, data);

            break;
          default:
            break;
        }

        socket.emit(IO_EVENTS.UI_CLIENT.WS_POST_COMMAND_SUCCEEDED, data);
      } catch (error) {
        socket.emit(IO_EVENTS.UI_CLIENT.WS_POST_COMMAND_FAILED, data);
      }
    });

    /**
     * Events coming from Game-Controller through Gateway
     */
    socket.on(IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE}`
        );
      }
      try {
        socketServer
          .to('web-clients')
          .emit(IO_EVENTS.UI_CLIENT.DEVICES_CONTEXT_UPDATE, data);
      } catch (error) {
        if (isDevEnvironment) {
          log(
            'error',
            `Event ${IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE} emitted from Client [id=${socket.id}] failed`
          );
        }
      }
    });
    socket.on(IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE}`
        );
      }
      try {
        socketServer
          .to('web-clients')
          .emit(IO_EVENTS.UI_CLIENT.TARGET_UPDATE, data);
      } catch (error) {
        if (isDevEnvironment) {
          log(
            'error',
            `Event ${IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE} emitted from Client [id=${socket.id}] failed`
          );
        }
      }
    });
    socket.on(IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT}`
        );
      }
      try {
        socketServer
          .to('web-clients')
          .emit(IO_EVENTS.UI_CLIENT.TARGET_HIT, data);
      } catch (error) {
        if (isDevEnvironment) {
          log(
            'error',
            `Event ${IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT} emitted from Client [id=${socket.id}] failed`
          );
        }
      }
    });
    socket.on(IO_EVENTS.GATEWAY_CLIENT.DISPLAY_UPDATE, (data) => {
      if (isDevEnvironment) {
        log(
          'info',
          `Client [id=${socket.id}] emitted event ${IO_EVENTS.GATEWAY_CLIENT.DISPLAY_UPDATE}`
        );
      }
      try {
        socketServer
          .to('web-clients')
          .emit(IO_EVENTS.UI_CLIENT.DISPLAY_UPDATE, data);
      } catch (error) {
        if (isDevEnvironment) {
          log(
            'error',
            `Event ${IO_EVENTS.GATEWAY_CLIENT.DISPLAY_UPDATE} emitted from Client [id=${socket.id}] failed`
          );
        }
      }
    });

    socket.on('disconnecting', () => {
      if (isDevEnvironment) {
        log('default', `Client will be disconnect [id=${socket.id}]`);
      }
    });

    /**
     * When socket disconnects, remove it from the list:
     */
    socket.on('disconnect', (reason) => {
      if (isDevEnvironment) {
        log('warning', `Client gone [id=${socket.id}]`, reason);
      }
    });
  });
};

export default { run };
