export default {
  Query: {
    getTasks: async (parent, args, { models }) => await models.Task.find(),
    getTask: async (parent, { id }, { models }) =>
      await models.Task.findById(id),
  },
  Mutation: {
    addTask: async (
      parent,
      { task, description, user },
      { models, pubsub }
    ) => {
      const record = await models.Task.create({ task, description, user });
      pubsub.publish('NEW_TASK', record);

      return record;
    },
  },
  Task: {
    user: async (parent, args, { models }) =>
      await models.User.findById(parent.user),
  },
};
