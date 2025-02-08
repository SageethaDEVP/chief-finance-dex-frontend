import gql from 'graphql-tag';

export const PAIR_VOLUME_QUERY = gql`
  query pairDayDatas($pairAddress: Bytes!) {
    pairDayDatas(first: 1, orderDirection: desc, where: { pairAddress: $pairAddress }) {
      id
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      totalSupply
      reserveUSD
    }
  }
`;

export type PairVolumeQueryResult = {
  pairDayDatas: {
    id: string;
    dailyVolumeUSD: string;
    token0: {
      id: string;
      symbol: string;
    };
    token1: {
      id: string;
      symbol: string;
    };
  }[];
};

export type TokensQueryResult = {
  tokens: {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
  }[];
};

export const PAIRS_VOLUME = gql`
  {
    pairDayDatas(orderBy: dailyVolumeUSD, where: { dailyVolumeUSD_gt: "1000000" }, orderDirection: desc) {
      id
      dailyVolumeUSD
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`;

export const PAIRS_VOLUME_BIDELITY = gql`
  {
    pairDayDatas(orderBy: dailyVolumeUSD, orderDirection: desc) {
      id
      dailyVolumeUSD
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`;

export const TOKENS_BIDELITY = gql`
  query MyQuery {
    tokens {
      id
      symbol
      name
      decimals
    }
  }
`;
