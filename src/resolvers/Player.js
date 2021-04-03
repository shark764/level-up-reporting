export default {
  Query: {
    getPlayers: async (parent, args, { models }) => await models.Player.find(),
    getPlayer: async (parent, { id }, { models }) =>
      await models.Player.findById(id),
  },
  Mutation: {
    addPlayer: async (parent, { name }, { models, pubsub }) => {
      const record = await models.Player.create({ name });
      pubsub.publish('NEW_PLAYER', record);

      return record;
    },
  },
  Player: {
    hits: async (parent, args, { models }) =>
      await models.Hit.find({ player: parent.id }),
  },
};
