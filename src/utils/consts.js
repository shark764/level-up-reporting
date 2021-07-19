export const whiteList = [
  /(localhost|127.0.0.1)./,
  'http://level-up-game-controller.herokuapp.com',
  'http://level-up-reporting.herokuapp.com',
  'https://level-up-game-controller.herokuapp.com',
  'https://level-up-reporting.herokuapp.com',
  'https://react-socket-io-client-1.herokuapp.com',
  'https://react-socket-io-client-1.netlify.app',
  'ws://level-up-game-controller.herokuapp.com',
  'ws://level-up-reporting.herokuapp.com',
  'wss://level-up-game-controller.herokuapp.com',
  'wss://level-up-reporting.herokuapp.com',
];

export const gameControllerPath = process.env.GAME_CONTROLLER_PATH;

export const reportingPath = process.env.REPORTING_PATH;

export const defaultOptions = {
  forceNew: true,
  reconnectionDelayMax: 10000,
  secure: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
  withCredentials: true,
  extraHeaders: {
    'levelup-token-header': 'levelup-token-header-value',
  },
  query: {
    type: 'gateway-server',
  },
};
export const clientOptions = {
  'game-controller': {
    ...defaultOptions,
    path: gameControllerPath,
  },
  'reporting-bff': {
    ...defaultOptions,
    path: reportingPath,
  },
};
export const getClientOptions = (type = 'reporting-bff') =>
  clientOptions[type] || defaultOptions;
