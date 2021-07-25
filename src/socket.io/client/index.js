import 'dotenv/config';
import { io } from 'socket.io-client';
import { log } from '../../utils';
import { getClientOptions } from '../../utils/consts';
import { EVENTS } from './events';

const gameControllerPort = process.env.GAME_CONTROLLER_PORT || 3011;
const reportingPort = process.env.REPORTING_PORT || 3009;
const isDevEnvironment = process.env.NODE_ENV === 'development';

const gameControllerUri = process.env.GAME_CONTROLLER_URI;
const reportingUri = process.env.REPORTING_URI;

/**
 * GAME CONTROLLER CLIENT
 * path = /game-controller-server
 * query
 *    type = gateway-server
 */
const gameControllerClient = io(
  gameControllerUri,
  getClientOptions('game-controller')
);

/**
 * REPORTING BFF CLIENT
 * path = /reporting-server
 * query
 *    type = gateway-server
 */
const reportingClient = io(reportingUri, getClientOptions('reporting-bff'));

/**
 * ******************************
 * EVENTS COMING FROM
 * GAME-CONTROLLER SERVER
 * ******************************
 */
const gameControllerEventsHandler = (args, message) => {
  /**
   * Formatting new event with extra data
   */
  const forwardedMessage = {
    'event-received': args.eventReceived,
    'event-emitted': args.eventEmitted,
    origin: 'game-controller',
    'socket-origin': gameControllerClient.id,
    target: 'reporting-bff',
    'socket-target': reportingClient.id,
    timestamp: new Date(),
    /**
     * Message coming from game-controller
     */
    data: message?.data ?? message ?? {},
  };
  if (isDevEnvironment) {
    log(
      'info',
      `\nMessage received from game-controller server [event=${args.eventReceived}]`
    );
    console.table([forwardedMessage]);
  }
  /**
   * Forward event to reporting-bff
   */
  reportingClient.emit(args.eventEmitted, forwardedMessage);
  if (isDevEnvironment) {
    log(
      'info',
      `\nMessage forwarded to reporting-bff server [event=${args.eventEmitted}]`
    );
  }

  /**
   * Callback from game-controller
   */

  // callback && callback({ data: { ...forwardedMessage } });
};

const runGameControllerClient = () => {
  gameControllerClient.connect();
  gameControllerClient.on('connect', () => {
    if (isDevEnvironment) {
      console.table([
        {
          Server: 'Game Controller',
          Port: gameControllerPort,
          'Accepting on': gameControllerUri,
          socket: gameControllerClient.id,
          'Connection established': new Date(),
        },
      ]);
    }
  });
  gameControllerClient.on('disconnect', (reason) => {
    if (isDevEnvironment) {
      log('warning', `Client gone [id=${gameControllerClient.id}]`, reason);
    }
  });

  /**
   * Update devices context
   * We emit the signal to reporting bff so it performs
   * update actions on devices
   */
  gameControllerClient.on(
    EVENTS.GAME_CONTROLLER.DEVICES_CONTEXT_UPDATE,
    gameControllerEventsHandler.bind(null, {
      eventReceived: EVENTS.GAME_CONTROLLER.DEVICES_CONTEXT_UPDATE,
      eventEmitted: EVENTS.REPORTING.DEVICES_CONTEXT_UPDATE,
    })
  );

  /**
   * Target Hit
   * We emit the signal to reporting bff so it registers a target hit
   */
  gameControllerClient.on(
    EVENTS.GAME_CONTROLLER.TARGET_HIT,
    gameControllerEventsHandler.bind(null, {
      eventReceived: EVENTS.GAME_CONTROLLER.TARGET_HIT,
      eventEmitted: EVENTS.REPORTING.TARGET_HIT,
    })
  );

  /**
   * Target Update
   * We emit the signal to reporting bff so it performs
   * target update actions
   */
  gameControllerClient.on(
    EVENTS.GAME_CONTROLLER.TARGET_UPDATE,
    gameControllerEventsHandler.bind(null, {
      eventReceived: EVENTS.GAME_CONTROLLER.TARGET_UPDATE,
      eventEmitted: EVENTS.REPORTING.TARGET_UPDATE,
    })
  );

  /**
   * Target Update
   * We emit the signal to reporting bff so it performs
   * target update actions
   */
  gameControllerClient.on(
    EVENTS.GAME_CONTROLLER.DISPLAY_UPDATE,
    gameControllerEventsHandler.bind(null, {
      eventReceived: EVENTS.GAME_CONTROLLER.DISPLAY_UPDATE,
      eventEmitted: EVENTS.REPORTING.DISPLAY_UPDATE,
    })
  );
};

/**
 * ******************************
 * EVENTS COMING FROM
 * REPORTING-BFF SERVER
 * ******************************
 */
const reportingEventsHandler = (args, message) => {
  /**
   * Formatting new event with extra data
   */
  const forwardedMessage = {
    'event-received': args.eventReceived,
    'event-emitted': args.eventEmitted,
    origin: 'reporting-bff',
    'socket-origin': reportingClient.id,
    target: 'game-controller',
    'socket-target': gameControllerClient.id,
    timestamp: new Date(),
    /**
     * Message coming from reporting-bff
     */
    data: message?.data ?? message ?? {},
  };
  if (isDevEnvironment) {
    log(
      'info',
      `\nMessage received from reporting-bff server [event=${args.eventReceived}]`
    );
    console.table([forwardedMessage]);
  }
  /**
   * Forward event to game-controller
   */
  gameControllerClient.emit(args.eventEmitted, forwardedMessage);
  if (isDevEnvironment) {
    log(
      'info',
      `\nMessage forwarded to game-controller server [event=${args.eventEmitted}]`
    );
    console.table([forwardedMessage]);
  }

  /**
   * Callback from reporting-bff
   */

  // callback && callback({ data: { ...forwardedMessage } });
};

const runReportingClient = () => {
  reportingClient.connect();
  reportingClient.on('connect', () => {
    if (isDevEnvironment) {
      console.table([
        {
          Server: 'Reporting BFF',
          Port: reportingPort,
          'Accepting on': reportingUri,
          socket: reportingClient.id,
          'Connection established': new Date(),
        },
      ]);
    }
  });
  reportingClient.on('disconnect', (reason) => {
    if (isDevEnvironment) {
      log('warning', `Client gone [id=${reportingClient.id}]`, reason);
    }
  });

  /**
   * 2.4 ) Game application sets CONFIG for smart target device
   */
  reportingClient.on(
    EVENTS.REPORTING.SET_DEVICE_CONFIG,
    reportingEventsHandler.bind(null, {
      eventReceived: EVENTS.REPORTING.SET_DEVICE_CONFIG,
      eventEmitted: EVENTS.GAME_CONTROLLER.SET_DEVICE_CONFIG,
    })
  );

  /**
   * 2.5 ) Game application sets behavior MODE for smart target device
   */
  reportingClient.on(
    EVENTS.REPORTING.SET_DEVICE_MODE,
    reportingEventsHandler.bind(null, {
      eventReceived: EVENTS.REPORTING.SET_DEVICE_MODE,
      eventEmitted: EVENTS.GAME_CONTROLLER.SET_DEVICE_MODE,
    })
  );

  /**
   * 2.6 ) Game application sends START event to a smart target device
   */
  reportingClient.on(
    EVENTS.REPORTING.START_DEVICE,
    reportingEventsHandler.bind(null, {
      eventReceived: EVENTS.REPORTING.START_DEVICE,
      eventEmitted: EVENTS.GAME_CONTROLLER.START_DEVICE,
    })
  );

  /**
   * 2.7 ) Game application requests for latest STATUS update from a smart target device
   */
  reportingClient.on(
    EVENTS.REPORTING.PING,
    reportingEventsHandler.bind(null, {
      eventReceived: EVENTS.REPORTING.PING,
      eventEmitted: EVENTS.GAME_CONTROLLER.PING,
    })
  );
};

const run = () => {
  runGameControllerClient();
  runReportingClient();
};

export default {
  gameControllerClient,
  reportingClient,
  runGameControllerClient,
  runReportingClient,
  run,
};
