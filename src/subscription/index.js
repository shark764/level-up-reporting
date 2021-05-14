import { PubSub } from 'apollo-server-express';
import * as GAME_EVENTS from './game';
import * as USER_EVENTS from './user';
import * as HIT_EVENTS from './hit';

export const EVENTS = {
  GAME: GAME_EVENTS,
  USER: USER_EVENTS,
  HIT: HIT_EVENTS,
};

export const subscriptionResolver = (event) => ({
  subscribe: (parent, args, context) => context.pubsub.asyncIterator(event),
  resolve: (payload) => payload,
});

export default new PubSub();
