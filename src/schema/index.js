import { SchemaComposer } from 'graphql-compose';

// import db from '../models/db';

const schemaComposer = new SchemaComposer();

import { UserMutation, UserQuery } from './user';
import { TaskMutation, TaskQuery } from './task';

schemaComposer.Query.addFields({
  ...UserQuery,
  ...TaskQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...TaskMutation,
});

export default schemaComposer.buildSchema();
