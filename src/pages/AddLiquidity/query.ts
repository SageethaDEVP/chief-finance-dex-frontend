import { gql } from 'graphql-tag';

export interface PairInfoInterface {
  lock: null | boolean;
  id: string;
}

export const PAIRS_LOCK_QUERY = gql`
  {
    pairs(orderBy: id, orderDirection: desc) {
      id
      lock
    }
  }
`;
