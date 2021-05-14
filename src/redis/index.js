import Redis from 'ioredis';
import { promisify } from 'util';

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.REDIS_PORT : process.env.DEV_REDIS_PORT;
const host = isProduction ? process.env.REDIS_HOST : process.env.DEV_REDIS_HOST;
const db = process.env.REDIS_DATABASE;
const password = process.env.REDIS_PASSWORD;

const client = new Redis({
  port,
  host,
  password,
  db,
});

export const sadd = (set, value, callback) => client.sadd(set, value, callback);

export const smembers = (set, callback) => client.smembers(set, callback);

const { hset, hgetall, get } = client;
export const GET_ASYNC = promisify(hset).bind(client);
export const SET_ASYNC = promisify(hgetall).bind(client);

export const getRefreshTokenValue = (token, callback) => get(token, callback);

export default client;
