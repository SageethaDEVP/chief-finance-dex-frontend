import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { Trade, TokenAmount, CurrencyAmount, ETHER } from '@bidelity/sdk';
import { useCallback, useMemo } from 'react';
import { useTokenAllowance } from '../data/Allowances';
import { Field } from '../state/swap/actions';
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks';
import { computeSlippageAdjustedAmounts } from '../utils/prices';
import { calculateGasMargin } from '../utils';
import { useTokenContract } from './useContract';
import { useActiveWeb3React } from './index';
import { BLID_ADDRESS, getContractData } from '../constants';

import {
  useApproveTokensModalOpen,
  useApproveTokensModalToggle,
  useErrorModalToggle,
} from '../state/application/hooks';
import { chainId_ChainName } from '../constants';

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React();
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender);
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  const toggleErrorModal = useErrorModalToggle();
  const toggleApproveModal = useApproveTokensModalToggle();
  const approveModalOpen = useApproveTokensModalOpen();

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    toggleApproveModal();
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!token) {
      console.error('no token');
      return;
    }

    if (!tokenContract) {
      console.error('tokenContract is null');
      return;
    }

    if (!amountToApprove) {
      console.error('missing amount to approve');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true;
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString());
    });

    return tokenContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        if (approveModalOpen) {
          toggleApproveModal();
        }
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
        });
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error);
        toggleApproveModal();
        toggleErrorModal();
      });
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    addTransaction,
    toggleApproveModal,
    toggleErrorModal,
    approveModalOpen,
  ]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const { chainId } = useActiveWeb3React();
  const ROUTER_CONTRACT_ADDRESS = getContractData(chainId as any).ROUTER_ADDRESS;

  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  );

  return useApproveCallback(amountToApprove, ROUTER_CONTRACT_ADDRESS);
}

export function useApproveCallbackFromBlid(trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  );
  return useApproveCallback(amountToApprove, BLID_ADDRESS);
}
