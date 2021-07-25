import { EVENTS as IO_EVENTS } from '../../socket.io/server/events';
import { log } from '../../utils';

const isDevEnvironment = process.env.NODE_ENV === 'development';

export const postCommandWSEvent = (req, res, next) => {
  try {
    const { socketServer } = req;
    const data = { ...req.body };
    const { eventType } = data;

    if (isDevEnvironment) {
      log(
        'info',
        `Websocket event will be fired as a result of HTTP request with event ${IO_EVENTS.UI_CLIENT.WS_POST_COMMAND} [type=${eventType}]`
      );
    }

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

    // socket.emit(IO_EVENTS.UI_CLIENT.WS_POST_COMMAND_SUCCEEDED, data);
  } catch (error) {
    // socket.emit(IO_EVENTS.UI_CLIENT.WS_POST_COMMAND_FAILED, data);
    log('error', 'An error ocurred', error);
  }

  next();
};
