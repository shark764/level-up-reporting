import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import addRequestId from 'express-request-id';
import mongoose from 'mongoose';
import logger from 'morgan';

/**
 * Connects to database
 */
import database from './models/db';
import { models } from './models/schemas';
/**
 * schema contains typeDefs
 * for Apollo Server
 */
import typeDefs from './typeDefs';
/**
 * resolvers
 */
import resolvers from './resolvers';

import pubsub from './subscription';
import { apolloPath, log } from './utils';
import { whiteList } from './utils/consts';

/**
 * Socket.io is attached to a new HTTP Server so it uses a different port
 * We need this since Apollo is already using HTTP Server previously configured.
 * Socket.IO then listen to a new HTTP Server with a different port.
 */
import ioServer from './socket.io/server';
import ioClient from './socket.io/client';

/**
 * Import routes
 */
import gameRouter from './routes/game.routes';
import heartbeatRouter from './routes/heartbeat.routes';
import testRouter from './routes/test.routes';

/**
 * Connect to database
 */
database.connect();

/**
 * Start Socket.IO server
 */
ioServer.run();
/**
 * Start Socket.IO client
 */
ioClient.run();

const domain = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || 3009;
const isDevEnvironment = process.env.NODE_ENV === 'development';

const app = express();

app.use(addRequestId());
if (isDevEnvironment) {
  app.use(logger('dev'));
  // Apply timeLog middleware
}

/**
 * Restricting access to server using a whitelist
 */
const corsOptions = {
  origin: whiteList,
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
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
    onConnect: () => {
      // connectionParams, webSocket, context
      log('success', `\nClient connected to subscription service`);
    },
    onDisconnect: () => {
      // webSocket, context
      log('error', `\nClient disconnected from subscription service`);
    },
  },
  context: {
    models,
    pubsub,
  },
  cors: true,
  playground: isDevEnvironment
    ? {
        endpoint: `http://${domain}:${port}${apolloPath}`,
        settings: {
          'editor.theme': 'dark',
        },
      }
    : false,
  introspection: true,
  tracing: true,
  path: apolloPath,
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
  path: apolloPath,
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

/**
 * Defining HTTP Endpoint Routes
 */
app.use('/api/v1', gameRouter);
app.use('/api/v1', heartbeatRouter);
app.use('/api/v1/tests', testRouter);

/**
 * Set port, listen for requests
 */
httpServer.listen({ port }, () => {
  log(
    'success',
    `\nHTTP Server listening on port ${port} ....`,
    `\nGraphql Server ready at http://${domain}:${port}${server.graphqlPath}`,
    `\nSubscriptions ready at ws://${domain}:${port}${server.subscriptionsPath}`,
    isDevEnvironment
      ? `\nRun Graphql Playground at http://${domain}:${port}${apolloPath}`
      : '',
    `\nStarting timestamp: ${new Date()}`
  );
});
