import { TokenList } from '@uniswap/token-lists/dist/types';
import { TagInfo, WrappedTokenInfo } from '../../../state/lists/hooks';
import { useMemo } from 'react';
import { Token } from '@bidelity/sdk';
// import { Chain, tokenAddresses, tokenInfo } from './types';

import axios from 'axios';
import {
  Chain,
  chains,
  tokenAddresses,
  tokenInfo,
  EMPTY_LIST_tokeninfo,
  ChainIds,
  TokenAddressMaptokeninfo,
  setOutPutChainId,
  routerAddresses,
} from '../../../constants';

const listCache: WeakMap<TokenList, TokenAddressMaptokeninfo> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMaptokeninfo>() : null;
export function listToTokenMap(list: TokenList): TokenAddressMaptokeninfo {
  const result = listCache?.get(list);
  if (result) return result;
  const map = list.tokens.reduce<any>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined;
            return { ...list.tags[tagId], id: tagId };
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? [];
      const token = new WrappedTokenInfo(tokenInfo, tags);
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.');
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list: list,
          },
        },
      };
    },
    { ...EMPTY_LIST_tokeninfo }
  );
  listCache?.set(list, map);
  // console.log('here 1', map);
  return map;
}

export function useTokensFromMap(
  tokenMap: TokenAddressMaptokeninfo,
  chainId: ChainIds | undefined
): { [address: string]: tokenInfo } {
  return useMemo(() => {
    if (!chainId) return {};
    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId])?.reduce<{ [address: string]: tokenInfo }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token;
        return newMap;
      },
      {}
    );

    return mapWithoutUrls;
  }, [chainId, tokenMap]);
}

export function TokensFromMap(
  tokenMap: TokenAddressMaptokeninfo,
  chainId: ChainIds | undefined
): { [address: string]: tokenInfo } {
  return useMemo(() => {
    if (!chainId) return {};
    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId])?.reduce<{ [address: string]: tokenInfo }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token;
        return newMap;
      },
      {}
    );

    return mapWithoutUrls;
  }, [chainId, tokenMap]);
}
// TODO

export function usePreSelectedCurrency(chainId: number) {
  const _inputCurrency: tokenInfo[] = Object.values(TokensFromMap(listToTokenMap(tokenAddresses), chainId));
  const inArr = useMemo(() => _inputCurrency, [_inputCurrency]);
  const _outputCurrency: tokenInfo[] = Object.values(
    TokensFromMap(listToTokenMap(tokenAddresses), setOutPutChainId[chainId])
  );
  const outArr = useMemo(() => _outputCurrency, [_outputCurrency]);

  const currIn = inArr[0];
  const currOut = outArr[0];

  return { currIn, currOut };
}

function getChainById(chainList: Chain[], targetChainId: number): Chain | undefined {
  return chainList.find((chain: Chain) => chain.chainId === targetChainId);
}

export function usePreSelectedChain(chainId: number) {
  const _chainIn = getChainById(chains, chainId);
  const _chainOut = getChainById(chains, setOutPutChainId[chainId]);
  const chainIn: any = useMemo(() => _chainIn, [_chainIn]);
  const chainOut: any = useMemo(() => _chainOut, [_chainOut]);
  return { chainIn, chainOut };
}

export function getRouterAddress(key: number): string {
  return routerAddresses[key]; // No error now
}

export const getStatus = async (transactionId: string) => {
  const result = await axios.get('https://testnet.api.0xsquid.com/v1/status', {
    params: {
      transactionId,
    },
    headers: {
      'x-integrator-id': "'yash-swap-widget",
    },
  });
  return result.data;
};
