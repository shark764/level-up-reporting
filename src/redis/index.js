import Redis from 'ioredis';
import { promisify } from 'util';

const port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOST;
const db = process.env.REDIS_DATABASE;
const password = process.env.REDIS_PASSWORD;

const client = new Redis({
  port,
  host,
  // password,
  // db,
  // tls: {},
});

export const sadd = (set, value, callback) => client.sadd(set, value, callback);

export const smembers = (set, callback) => client.smembers(set, callback);

export const GET_ASYNC = promisify(client.hset).bind(client);
export const SET_ASYNC = promisify(client.hgetall).bind(client);

export const getRefreshTokenValue = (token, callback) =>
  client.get(token, callback);

export default client;
