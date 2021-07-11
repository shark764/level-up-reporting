export const whiteList = [
  /(localhost|127.0.0.1)./,
  'https://level-up-game-controller-gateway.herokuapp.com',
  'https://level-up-game-controller.herokuapp.com',
  'https://level-up-reporting-bff.herokuapp.com',
  'https://react-socket-io-client-1.herokuapp.com',
  'https://react-socket-io-client-1.netlify.app',
];

export const gameControllerPath = process.env.GAME_CONTROLLER_PATH;

export const reportingPath = process.env.REPORTING_PATH;

export const defaultOptions = {
  reconnectionDelayMax: 10000,
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
