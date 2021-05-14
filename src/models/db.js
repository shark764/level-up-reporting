import mongoose from 'mongoose';
import 'dotenv/config';
import { log } from '../utils';

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.DB_CONNECTION_STRING, {
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
      `\n\tString connection: ${process.env.DB_CONNECTION_STRING}`,
      `\n\tStarting timestamp: ${new Date()}`
    );
    return db;
  })
  .catch((err) => {
    log('error', `Cannot connect to the database...`, err);
    process.exit();
  });
export default connection;
