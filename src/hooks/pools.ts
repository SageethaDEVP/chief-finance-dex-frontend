import { useEffect, useMemo, useState } from 'react';
import ERC20_INTERFACE from '../constants/abis/erc20';
import { PAIR_INTERFACE } from '../data/Reserves';
import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { useFactoryContract, useMulticallContract } from './useContract';
import { useActiveWeb3React } from 'hooks';
import { chainId_ChainName } from '../../src/constants/index';
import { Factory } from 'constants/contractConstants';

export interface PoolCurrency {
  token0: string;
  token1: string;
  symbol0: string;
  symbol1: string;
  pairAddress: string;
  volume: string;
}

export function usePools(): PoolCurrency[] {
  const [data, setData] = useState([]);
  const { chainId } = useActiveWeb3React();

  const factory = useFactoryContract();

  // const count = await factory?.allPairsLength();

  const mockCount = 100;

  const multicall = useMulticallContract();

  const callData: any = [];

  const FACTORY_CONTRACT_PRIMARY_ADDRESS = Factory[chainId || 11155111];

  for (let i = 0; i <= mockCount; i++) {
    callData.push([FACTORY_CONTRACT_PRIMARY_ADDRESS, factory?.interface.encodeFunctionData('allPairs', [i])]);
  }

  const fetchData = async () => {
    const [, returnData] = await multicall?.aggregate(callData);
    return returnData;
  };

  // const fetchCount = async () => {
  //   return await factory?.allPairsLength();
  // };

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  const poolAddresses = useMemo(() => {
    return data.reduce((response: any, aggregateItemResult: any, i: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const data: string[] = factory?.interface.decodeFunctionResult('allPairs', aggregateItemResult);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      response[i] = data[0];

      return response;
    }, []);
  }, [data]);

  const tokens0 = useMultipleContractSingleData(poolAddresses, PAIR_INTERFACE, 'token0');
  const tokens1 = useMultipleContractSingleData(poolAddresses, PAIR_INTERFACE, 'token1');

  const addressesArray = tokens0.reduce((acc, current, index) => {
    if (current.result && tokens1[index].result) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      acc.push(current?.result?.[0]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      acc.push(tokens1[index]?.result?.[0]);
    }
    return acc;
  }, []);

  const symbols = useMultipleContractSingleData(addressesArray, ERC20_INTERFACE, 'symbol');

  const even = symbols.filter((item, index) => index === 0 || !(index % 2));
  const notEven = symbols.filter((item, index) => index % 2);

  return tokens0.reduce((acc: any, current, index) => {
    if (current.result && tokens1[index].result) {
      acc.push({
        token0: current?.result?.[0],
        token1: tokens1[index]?.result?.[0],
        symbol0: even[index].result?.[0],
        symbol1: notEven[index].result?.[0],
        pairAddress: poolAddresses[index],
      });
    }
    return acc;
  }, []);
}
