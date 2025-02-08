import { useFactoryContract } from './useContract';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export function useSwapPercents() {
  const [fee, setFee] = useState('');
  const factory = useFactoryContract();

  const getFees = async (): Promise<string | void> => {
    try {
      const swapBN = await factory?.swapFeeBP();
      const swapFee = ethers.utils.formatUnits(swapBN, 2);
      if (swapFee) {
        setFee(swapFee);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFees();
  }, [factory]);

  return Number(fee);
}
