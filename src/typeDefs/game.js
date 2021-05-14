import { gql } from 'apollo-server-express';

export const game = gql`
  extend type Query {
    getGames: [Game!]
    getGame(id: ID!): Game
  }

  extend type Mutation {
    addGame(name: String!): Game!
    updateGame(id: ID!, name: String!): Game
    removeGame(id: ID!): Game
  }

  type Game {
    id: ID!
    name: String!
    hits: [Hit!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  extend type Subscription {
    gameCreated: Game!
  }
`;
