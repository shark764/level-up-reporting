import { gql } from 'apollo-server-express';

import { shared } from './shared';
import { game } from './game';
import { hit } from './hit';
import { user } from './user';

const root = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Subscription {
    root: String
  }
`;

const typeDefs = [root, shared, game, hit, user];

export default typeDefs;
