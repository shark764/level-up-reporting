import { TaskTC } from '../models/task';
import { User, UserTC } from '../models/user';

UserTC.addResolver({
  name: 'tasks',
  args: { id: 'String' },
  type: UserTC,
  resolve: async ({ source, args, context, info }) => {
    console.log({ source, args, context, info });
    return await TaskTC.find({
      user: args.id,
    });
  },
});

const UserQuery = {
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination'),
  tasks: UserTC.getResolver('tasks'),
};

const UserMutation = {
  userCreateOne: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),
};

export { UserQuery, UserMutation };
