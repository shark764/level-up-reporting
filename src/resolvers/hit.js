import { subscriptionResolver, EVENTS } from '../subscription';

export const hit = {
  Query: {
    getHits: async (parent, args, { models }) => await models.Hit.find(),
    getHit: async (parent, { id }, { models }) => await models.Hit.findById(id),
  },
  Mutation: {
    addHit: async (
      parent,
      { gameId, deviceId, value1, value2, value3, value4 },
      { models, pubsub }
    ) => {
      const record = await models.Hit.create({
        gameId,
        deviceId,
        value1,
        value2,
        value3,
        value4,
      });
      pubsub.publish(EVENTS.HIT.HIT_CREATED, record);

      return record;
    },
  },
  Hit: {
    /*user: async (parent, args, { models }) =>
      await models.User.findById(parent.user),*/
    game: async (parent, args, { models }) =>
      await models.Game.findById(parent.gameId),
  },

  Subscription: {
    hitAdded: subscriptionResolver(EVENTS.HIT.HIT_CREATED),
    hitBatch: subscriptionResolver(EVENTS.HIT.HIT_BATCH),
  },
};
