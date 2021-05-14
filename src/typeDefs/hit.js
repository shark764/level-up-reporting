import { gql } from 'apollo-server-express';

export const hit = gql`
  extend type Query {
    getHits: [Hit!]
    getHit(id: ID!): Hit
  }

  extend type Mutation {
    addHit(
      deviceId: String!
      value1: Int
      value2: Int
      value3: Int
      value4: Int
      user: ID!
      game: ID!
    ): Hit!
    updateHit(id: ID!, deviceId: String!): Hit
    removeHit(id: ID!): Hit
  }

  type Hit {
    id: ID!
    deviceId: String!
    value1: Int
    value2: Int
    value3: Int
    value4: Int
    user: User!
    game: Game!
    createdAt: DateTime
    updatedAt: DateTime
  }

  extend type Subscription {
    hitAdded: Hit!
    hitBatch: [Hit!]!
  }
`;
