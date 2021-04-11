import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import addRequestId from 'express-request-id';

import mongoose from 'mongoose';

/**
 * Connects to database
 */
import './models/db';
import { models } from './models';
/**
 * schema contains typeDefs
 * for Apollo Server
 */
import schema from './schema';
/**
 * resolvers
 */
import resolvers from './resolvers';

import './socket.io/client';

import pubsub from './subscription';
import { log } from './utils';

const port = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(addRequestId());

/**
 * Restricting access to server using a whitelist
 */
const corsOptions = {
  origin: [
    /(localhost|127.0.0.1)./,
    'https://react-socket-io-client-1.herokuapp.com',
    'https://react-socket-io-client-1.netlify.app',
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

/**
 * Parse requests of content-type - application/json
 * Used to parse JSON bodies
 * WARNING!:
 *    body-parser has been deprecated
 */
app.use(express.json());

/**
 * Parse requests of content-type - application/x-www-form-urlencoded
 * Parse URL-encoded bodies
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Use the express-static middleware
 */
app.use(express.static('public'));

const httpServer = createServer(app);

const server = new ApolloServer({
  // schema,
  typeDefs: schema,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
    onConnect: (connectionParams, webSocket, context) => {
      log('success', `\nConnected to subscription service!`);
    },
    onDisconnect: (webSocket, context) => {
      log('error', `\nDisconnected from subscription service!`);
    },
  },
  context: {
    models,
    pubsub,
  },
  cors: true,
  playground: !isProduction
    ? {
        endpoint: `http://localhost:${port}/levelup-graphql`,
        settings: {
          'editor.theme': 'dark',
        },
      }
    : false,
  introspection: true,
  tracing: true,
  path: '/levelup-graphql',
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
});

server.applyMiddleware({
  app,
  path: '/levelup-graphql',
  cors: true,
  onHealthCheck: () =>
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState > 0) {
        resolve();
      } else {
        reject();
      }
    }),
});
server.installSubscriptionHandlers(httpServer);

const ioServer = new Server(httpServer, {
  path: '/levelup-socket.io',
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

const connectedSocketClients = new Map();

ioServer.on('connection', (socket) => {
  log('info', `Client connected [id=${socket.id}]`);
  // console.log('headers', socket.handshake.headers); // levelup-token-header
  const { type } = socket.handshake.query;
  connectedSocketClients.set(socket.id, {
    type,
    socket,
  });

  /**
   * Handle when socket client sends data
   */
  socket.on('_game_running-test-data', (data) => {
    console.log('_game_running-test-data', data);
    socket.emit('_game_event-hit', { data });
  });

  /**
   * When socket disconnects, remove it from the list:
   */
  socket.on('disconnect', (reason) => {
    connectedSocketClients.delete(socket.id);
    log('warning', `Client gone [id=${socket.id}]`, reason);
  });
});

/**
 * Define the first route
 */
app.get('/hello', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});
/**
 * Simple GET route
 */
app.get('/greeting', (req, res) => {
  res.json({ message: 'Hola mundo!' });
});

app.get('/ioclient', (req, res) => {
  res.sendFile(path.join(process.cwd() + '/public/testioclient.html'));
});

/**
 * Set port, listen for requests
 */
httpServer.listen({ port }, () => {
  log(
    'success',
    `\nServer listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
  log(
    'info',
    `\tGraphql Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  log(
    'info',
    `\tSubscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  );
  if (!isProduction) {
    log(
      'default',
      `\tRun Graphql Playground at http://localhost:${port}/graphql`
    );
  }
});
