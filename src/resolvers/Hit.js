export default {
  Query: {
    getHits: async (parent, args, { models }) => await models.Hit.find(),
    getHit: async (parent, { id }, { models }) => await models.Hit.findById(id),
  },
  Mutation: {
    addHit: async (
      parent,
      { player, game, deviceId, value1, value2, value3, value4 },
      { models, pubsub }
    ) => {
      const record = await models.Hit.create({
        player,
        game,
        deviceId,
        value1,
        value2,
        value3,
        value4,
      });
      pubsub.publish('NEW_HIT', record);

      return record;
    },
  },
  Hit: {
    player: async (parent, args, { models }) =>
      await models.Player.findById(parent.player),
    game: async (parent, args, { models }) =>
      await models.Game.findById(parent.game),
  },
};
