import mongoose from 'mongoose';
import 'dotenv/config';
import { log } from '../utils';

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

const isDevEnvironment = process.env.NODE_ENV === 'development';

let connection;

async function connect() {
  try {
    connection = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      autoIndex: true,
      poolSize: 50,
      bufferMaxEntries: 0,
      keepAlive: 120,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    if (isDevEnvironment) {
      log(
        'success',
        `Connected to mongodb database [connection-string=${
          process.env.DB_CONNECTION_STRING
        }] [starting timestamp=${new Date()}]`
      );
    }
    return connection;
  } catch (error) {
    if (isDevEnvironment) {
      log('error', `Cannot connect to the database...`, error);
    }
    process.exit();
  }
}

export default { connect, connection };
