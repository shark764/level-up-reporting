import { connection } from './db';
import { User } from './User';
import { Task } from './Task';
import { Message } from './Message';
import { Game } from './Game';
import { Player } from './Player';
import { Hit } from './Hit';

const models = { User, Task, Message, Game, Player, Hit };
export { connection, models };

export default models;
