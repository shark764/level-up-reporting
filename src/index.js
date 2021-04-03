import 'dotenv/config';
import express from 'express';
const bodyParser = require('body-parser');
const cors = require('cors');
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';

import mongoose from 'mongoose';

/**
 * Connects to database
 */
import './models/db';
import models from './models';
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

const port = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

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
 */
app.use(bodyParser.json());

/**
 * Parse requests of content-type - application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Use the express-static middleware
 */
app.use(express.static('public'));

const server = new ApolloServer({
  // schema,
  typeDefs: schema,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
    onConnect: (connectionParams, webSocket, context) => {
      console.log('\x1b[35m%s\x1b[0m', `\nConnected to subscription service!`);
    },
    onDisconnect: (webSocket, context) => {
      console.log(
        '\x1b[31m%s\x1b[0m',
        `\nDisconnected from subscription service!`
      );
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

const httpServer = createServer(app);

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

/**
 * Define the first route
 */
app.get('/hello', function(req, res) {
  res.send('<h1>Hello World!</h1>');
});
/**
 * Simple GET route
 */
app.get('/greeting', (req, res) => {
  res.json({ message: 'Hola mundo!' });
});

/**
 * Set port, listen for requests
 */
httpServer.listen({ port }, () => {
  console.log(
    '\x1b[33m%s\x1b[0m',
    `\nServer listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
  console.log(
    '\x1b[35m%s\x1b[0m',
    `\tGraphql Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  console.log(
    '\x1b[35m%s\x1b[0m',
    `\tSubscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  );
  if (!isProduction) {
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\tRun Graphql Playground at http://localhost:${port}/graphql`
    );
  }
});
