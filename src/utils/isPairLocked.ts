import { Pair } from '../../forks/@bidelity/sdk';
import { PairInfoInterface } from '../pages/AddLiquidity/query';

export const isPairLocked = (pairsList: PairInfoInterface[], pair: Pair) => {
  if (pairsList.length === 0) return false;
  const lockedAddresses = pairsList.filter((p: PairInfoInterface) => p.lock).map((p: PairInfoInterface) => p.id);
  return lockedAddresses?.includes(pair?.liquidityToken?.address?.toLowerCase());
};
