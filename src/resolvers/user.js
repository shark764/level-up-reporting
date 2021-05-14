export const user = {
  Query: {
    getUsers: async (parent, args, { models }) => await models.User.find(),
    getUser: async (parent, { id }, { models }) =>
      await models.User.findById(id),
  },
  Mutation: {
    addUser: async (parent, { name, email }, { models, pubsub }) => {
      const record = await models.User.create({ name, email });
      pubsub.publish('NEW_USER', record);

      return record;
    },
  },
  User: {
    hits: async (parent, args, { models }) =>
      await models.Hit.find({ user: parent.id }),
  },
};
