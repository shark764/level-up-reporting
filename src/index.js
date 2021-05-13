import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
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

import pubsub from './subscription';
import { apolloPath, log } from './utils';
import { whiteList } from './utils/consts';

/**
 * Socket.io is attached to a new HTTP Server so it uses a different port
 * We need this since Apollo is already using HTTP Server previously configured.
 * Socket.IO then listen to a new HTTP Server with a different port.
 */
import './socket.io/server';
import gameRouter from './routes/game.routes';
import heartbeatRouter from './routes/heartbeat.routes';

const domain = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(addRequestId());

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
  typeDefs: schema,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
    onConnect: (connectionParams, webSocket, context) => {
      log('success', `\nClient connected to subscription service!`);
    },
    onDisconnect: (webSocket, context) => {
      log('error', `\nClient disconnected from subscription service!`);
    },
  },
  context: {
    models,
    pubsub,
  },
  cors: true,
  playground: !isProduction
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
 * Defining HTTP Endpoint Routes
 */
app.use('/api/v1/game', gameRouter);
app.use('/api/v1/heartbeat', heartbeatRouter);

/**
 * Set port, listen for requests
 */
httpServer.listen({ port }, () => {
  log(
    'success',
    `\nHTTP Server listening on port ${port} ....`,
    `\n\tGraphql Server ready at http://${domain}:${port}${server.graphqlPath}`,
    `\n\tSubscriptions ready at ws://${domain}:${port}${server.subscriptionsPath}`,
    !isProduction
      ? `\n\tRun Graphql Playground at http://${domain}:${port}${apolloPath}`
      : '',
    `\n\tStarting timestamp: ${new Date()}`
  );
});
