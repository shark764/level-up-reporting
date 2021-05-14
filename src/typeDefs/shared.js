import { gql } from 'apollo-server-express';

export const shared = gql`
  scalar DateTime

  enum Sort {
    asc
    desc
  }
`;
