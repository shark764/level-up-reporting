export const whiteList = [
  /(localhost|127.0.0.1)./,
  'https://level-up-game-controller-gateway.herokuapp.com',
  'https://level-up-game-controller.herokuapp.com',
  'https://level-up-reporting-bff.herokuapp.com',
  'https://react-socket-io-client-1.herokuapp.com',
  'https://react-socket-io-client-1.netlify.app',
];

export const gcSocketIOPath = '/game-controller-socket.io';

export const rpbffSocketIOPath = '/reporting-bff-socket.io';

// eslint-disable-next-line max-len
export const socketToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const defaultOptions = {
  reconnectionDelayMax: 10000,
  withCredentials: true,
  extraHeaders: {
    'levelup-token-header': socketToken,
  },
  query: {
    type: 'gateway-server',
  },
};
export const clientOptions = {
  'game-controller': {
    ...defaultOptions,
    path: gcSocketIOPath,
  },
  'reporting-bff': {
    ...defaultOptions,
    path: rpbffSocketIOPath,
  },
};
export const getClientOptions = (type = 'reporting-bff') =>
  clientOptions[type] || defaultOptions;
