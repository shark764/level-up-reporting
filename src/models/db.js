import mongoose from 'mongoose';
import 'dotenv/config';
import { log } from '../utils';

mongoose.Promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';
const DB_CONNECTION_URI = isProduction
  ? process.env.DB_CONNECTION_URI
  : process.env.DEV_DB_CONNECTION_URI;

const connection = mongoose.connect(DB_CONNECTION_URI, {
  autoIndex: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  keepAlive: 120,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.set('useCreateIndex', true);

connection
  .then((db) => {
    log(
      'success',
      `\nConnected to mongodb database ....`,
      `\n\tString connection: ${DB_CONNECTION_URI}`,
      `\n\tStarting timestamp: ${new Date()}`
    );
    return db;
  })
  .catch((err) => {
    log('error', `Cannot connect to the database...`, err);
    process.exit();
  });
export default connection;
