import connection from './db';
import { User } from './user';
import { Game } from './game';
import { Hit } from './hit';

const models = { User, Game, Hit };
export { connection, models };

export default models;
