import { Contract } from '@ethersproject/contracts';
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { useMemo } from 'react';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector';
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import ERC20_ABI from '../constants/abis/erc20.json';
import { FACTORY_ABI } from '../constants/abis/factory_abi';
import WETH_ABI from '../constants/abis/weth.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall';
import { getContract } from '../utils';
import { useActiveWeb3React } from './index';
import { ChainId } from '../constants/contractConstants';
import { WETH, getContractData } from '../constants';

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? WETH[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  // const chainId = 5;
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  );
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false);
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible);
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  const contractData = getContractData(chainId as any);
  return useContract(contractData.FACTORY_ADDRESS, FACTORY_ABI, false);
}
