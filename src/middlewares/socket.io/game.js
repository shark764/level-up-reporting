import ioServer from '../../socket.io/server';
import { EVENTS as IO_EVENTS } from '../../socket.io/server/events';
import { log } from '../../utils';
import { error } from '../../utils/response';

const { socketServer } = ioServer;
const isDevEnvironment = process.env.NODE_ENV === 'development';

export const devicesContextUpdate = (req, res, next) => {
  if (isDevEnvironment) {
    log(
      'info',
      `Websocket event type=[${IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE}] is fired as a result of HTTP request`
    );
  }
  try {
    socketServer
      .to('gateway-servers')
      .emit(IO_EVENTS.GATEWAY_CLIENT.DEVICES_CONTEXT_UPDATE, req.body);
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_SUCCEEDED, req.body);
  } catch (error) {
    if (isDevEnvironment) {
      log('error', 'An error ocurred', error);
    }
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_FAILED, req.body);
  }

  next();
};

export const targetUpdate = (req, res, next) => {
  if (isDevEnvironment) {
    log(
      'info',
      `Websocket event type=[${IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE}] is fired as a result of HTTP request`
    );
  }
  try {
    socketServer
      .to('gateway-servers')
      .emit(IO_EVENTS.GATEWAY_CLIENT.TARGET_UPDATE, req.body);
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_SUCCEEDED, req.body);
  } catch (error) {
    if (isDevEnvironment) {
      log('error', 'An error ocurred', error);
    }
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_FAILED, req.body);
  }

  next();
};

export const targetHit = (req, res, next) => {
  if (isDevEnvironment) {
    log(
      'info',
      `Websocket event type=[${IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT}] is fired as a result of HTTP request`
    );
  }
  try {
    socketServer
      .to('gateway-servers')
      .emit(IO_EVENTS.GATEWAY_CLIENT.TARGET_HIT, req.body);
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_SUCCEEDED, req.body);
  } catch (error) {
    if (isDevEnvironment) {
      log('error', 'An error ocurred', error);
    }
    socketServer
      .to('web-clients')
      .emit(IO_EVENTS.UI_CLIENT.START_GAME_FAILED, req.body);
  }

  next();
};
