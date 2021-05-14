import 'dotenv/config';
import { io } from 'socket.io-client';
import { log } from '../../utils';
import { getClientOptions } from '../../utils/consts';
import { EVENTS } from './events';

const domain = process.env.DOMAIN || 'localhost';
const gcPort = process.env.GAME_CONTROLLER_PORT || 8001;
const rpbffPort = process.env.REPORTING_BFF_PORT || 8001;
const isProduction = process.env.NODE_ENV === 'production';
// const gcUri = `http://${domain}:${gcPort}`;
const gcUri = `https://level-up-game-controller.herokuapp.com/`;
const rpbffUri = `http://${domain}:${rpbffPort}`;

/**
 * GAME CONTROLLER CLIENT
 * path = /game-controller-socket.io
 * query
 *    type = gateway-server
 */
const socketGameController = io(gcUri, getClientOptions('game-controller'));
socketGameController.connect();
socketGameController.on('connect', () => {
  log(
    'success',
    `\nSocket.IO Client active and listening on port ${gcPort} ....`,
    `\n\tGame Controller client accepting messages from: ${gcUri}`,
    `\n\tSocket open: ${socketGameController.id}`,
    `\n\tStarting timestamp: ${new Date()}`
  );
});

/**
 * REPORTING BFF CLIENT
 * path = /reporting-bff-socket.io
 * query
 *    type = gateway-server
 */
const socketReportingBFF = io(rpbffUri, getClientOptions('reporting-bff'));
socketReportingBFF.connect();
socketReportingBFF.on('connect', () => {
  log(
    'success',
    `\nSocket.IO Client active and listening on port ${rpbffPort} ....`,
    `\n\tReporting BFF client accepting messages from: ${rpbffUri}`,
    `\n\tSocket open: ${socketReportingBFF.id}`,
    `\n\tStarting timestamp: ${new Date()}`
  );
});

/**
 * ******************************
 * EVENTS COMMING FROM
 * GAME-CONTROLLER SERVER
 * ******************************
 */
const gcEventsHandler = (args, message, callback) => {
  if (!isProduction) {
    log('info', `\nMessage received from game-controller server`, message);
  }
  /**
   * Formatting new event with extra data
   */
  const fwMessage = {
    'event-received': args.eventReceived,
    'event-emitted': args.eventEmitted,
    'game-controller-socket-id': socketGameController.id,
    'reporting-bff-socket-id': socketReportingBFF.id,
    timestamp: new Date(),
    /**
     * Message comming from game-controller
     */
    ...message,
  };
  /**
   * Forward event to reporting-bff
   */
  socketReportingBFF.emit(args.eventEmitted, fwMessage);
  if (!isProduction) {
    log('info', `\nMessage forwarded to reporting-bff server`, fwMessage);
  }

  /**
   * Callback from game-controller
   */

  // callback && callback({ data: { ...fwMessage } });
};

/**
 * Start Game
 * We emit the signal to reporting bff so it registers a new game
 */
socketGameController.on(
  EVENTS.GAME_CONTROLLER.START_GAME,
  gcEventsHandler.bind(null, {
    eventReceived: EVENTS.GAME_CONTROLLER.START_GAME,
    eventEmitted: EVENTS.REPORTING_BFF.START_GAME,
  })
);

/**
 * Target Hit
 * We emit the signal to reporting bff so it registers a target hit
 */
socketGameController.on(
  EVENTS.GAME_CONTROLLER.TARGET_HIT,
  gcEventsHandler.bind(null, {
    eventReceived: EVENTS.GAME_CONTROLLER.TARGET_HIT,
    eventEmitted: EVENTS.REPORTING_BFF.TARGET_HIT,
  })
);

/**
 * Finish Game
 * We emit the signal to reporting bff so it registers a target hit
 */
socketGameController.on(
  EVENTS.GAME_CONTROLLER.FINISH_GAME,
  gcEventsHandler.bind(null, {
    eventReceived: EVENTS.GAME_CONTROLLER.FINISH_GAME,
    eventEmitted: EVENTS.REPORTING_BFF.FINISH_GAME,
  })
);

/**
 * ******************************
 * EVENTS COMMING FROM
 * REPORTING-BFF SERVER
 * ******************************
 */

const rpbffEventsHandler = (args, message, callback) => {
  if (!isProduction) {
    log('info', `\nMessage received from reporting-bff server`, message);
  }
  /**
   * Formatting new event with extra data
   */
  const fwMessage = {
    'event-received': args.eventReceived,
    'event-emitted': args.eventEmitted,
    'game-controller-socket-id': socketGameController.id,
    'reporting-bff-socket-id': socketReportingBFF.id,
    timestamp: new Date(),
    /**
     * Message comming from reporting-bff
     */
    ...message,
  };
  /**
   * Forward event to game-controller
   */
  socketGameController.emit(args.eventEmitted, fwMessage);
  if (!isProduction) {
    log('info', `\nMessage forwarded to game-controller server`, fwMessage);
  }

  /**
   * Callback from reporting-bff
   */

  // callback && callback({ data: { ...fwMessage } });
};

/**
 * Game Started
 * Reporting BFF emits a signal when a game has been created
 */
socketReportingBFF.on(
  EVENTS.REPORTING_BFF.GAME_STARTED,
  rpbffEventsHandler.bind(null, {
    eventReceived: EVENTS.REPORTING_BFF.GAME_STARTED,
    eventEmitted: EVENTS.GAME_CONTROLLER.GAME_STARTED,
  })
);

/**
 * Target Hit Registered
 * Reporting BFF emits a signal when a target-hit was receibed
 */
socketReportingBFF.on(
  EVENTS.REPORTING_BFF.TARGET_HIT,
  rpbffEventsHandler.bind(null, {
    eventReceived: EVENTS.REPORTING_BFF.TARGET_HIT,
    eventEmitted: EVENTS.GAME_CONTROLLER.TARGET_HIT,
  })
);

/**
 * Game Finished
 * Reporting BFF emits a signal when a game was finished
 * and hits were inserted in database
 */
socketReportingBFF.on(
  EVENTS.REPORTING_BFF.GAME_FINISHED,
  rpbffEventsHandler.bind(null, {
    eventReceived: EVENTS.REPORTING_BFF.GAME_FINISHED,
    eventEmitted: EVENTS.GAME_CONTROLLER.GAME_FINISHED,
  })
);
