import { subscriptionResolver, EVENTS } from '../subscription';

export const game = {
  Query: {
    getGames: async (parent, args, { models }) => await models.Game.find(),
    getGame: async (parent, { id }, { models }) =>
      await models.Game.findById(id),
  },
  Mutation: {
    addGame: async (parent, { name }, { models, pubsub }) => {
      // const record = await models.Game.create({ name });
      const record = await { id: '1234', name: 'Game #1' };
      pubsub.publish(EVENTS.GAME.GAME_CREATED, record);

      return record;
    },
  },
  Game: {
    hits: async (parent, args, { models }) =>
      await models.Hit.find({ gameId: parent.id }),
  },

  Subscription: {
    gameCreated: subscriptionResolver(EVENTS.GAME.GAME_CREATED),
  },
};
