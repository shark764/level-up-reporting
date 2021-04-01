import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGODB_URI, {
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
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nConnected to mongodb database ....`,
      `\n\tStart date: ${new Date()}`
    );
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\tString connection: ${process.env.MONGODB_URI}`
    );
    return db;
  })
  .catch((err) => {
    console.log('\x1b[31m%s\x1b[0m', `Cannot connect to the database...`, err);
    process.exit();
  });

export default connection;
