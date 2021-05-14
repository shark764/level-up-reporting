import { gql } from 'apollo-server-express';

export const user = gql`
  extend type Query {
    getUsers: [User!]
    getUser(id: ID!): User
  }

  extend type Mutation {
    addUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String!, email: String!): User
    removeUser(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    hits: [Hit!]
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
