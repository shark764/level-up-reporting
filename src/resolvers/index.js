import { merge } from 'lodash';

import { shared } from './shared';
import { game } from './game';
import { hit } from './hit';
import { user } from './user';

const resolvers = merge(shared, game, hit, user);

export default resolvers;
