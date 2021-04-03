import { PubSub } from 'apollo-server-express';
import * as GAME_EVENTS from './Game';
import * as PLAYER_EVENTS from './Player';
import * as HIT_EVENTS from './Hit';

export const EVENTS = {
  GAME: GAME_EVENTS,
  PLAYER: PLAYER_EVENTS,
  HIT: HIT_EVENTS,
};

export const subscriptionResolver = (event) => ({
  subscribe: (parent, args, context, info) =>
    context.pubsub.asyncIterator(event),
  resolve: (payload) => payload,
});

export default new PubSub();
