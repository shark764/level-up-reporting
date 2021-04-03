export default {
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
    messages: async (parent, args, { models }) =>
      await models.Message.find({ user: parent.id }),
    tasks: async (parent, args, { models }) =>
      await models.Task.find({ user: parent.id }),
  },
};
