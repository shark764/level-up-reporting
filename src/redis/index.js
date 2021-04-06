import * as redis from 'ioredis';

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

const sadd = (set, value, callback) => client.sadd(set, value, callback);

const smembers = (set, callback) => client.smembers(set, callback);

export { sadd, smembers };
