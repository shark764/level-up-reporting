import 'dotenv/config';
import express from 'express';
const bodyParser = require('body-parser');
const cors = require('cors');
import { ApolloServer } from 'apollo-server-express';

import mongoose from 'mongoose';

/**
 * Connects to database
 */
import './models/db';
/**
 * schema contains typeDefs and Resolvers
 * for Apollo Server
 */
import schema from './schema';

import './socket.io/client';

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
  schema,
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
  path: '/',
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
app.listen({ port }, () => {
  console.log(
    '\x1b[33m%s\x1b[0m',
    `\nServer listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
  if (!isProduction) {
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\tRun Graphql Playground at http://localhost:${port}/graphql`
    );
  }
});
