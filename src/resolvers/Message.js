export default {
  Query: {
    getMessages: async (parent, args, { models }) =>
      await models.Message.find(),
    getMessage: async (parent, { id }, { models }) =>
      await models.Message.findById(id),
  },
  Mutation: {
    addMessage: async (parent, { text, user }, { models, pubsub }) => {
      const record = await models.Message.create({ text, user });
      pubsub.publish('NEW_MESSAGE', record);

      return record;
    },
  },
  Message: {
    user: async (parent, args, { models }) =>
      await models.User.findById(parent.user),
  },
};
