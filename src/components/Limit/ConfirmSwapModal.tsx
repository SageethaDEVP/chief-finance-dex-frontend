import { currencyEquals, Trade, Pair } from '@bidelity/sdk';
import React, { useCallback, useMemo } from 'react';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../TransactionConfirmationModal';
import SwapModalFooter from './SwapModalFooter';
import SwapModalHeader from './SwapModalHeader';
import { PairState } from '../../data/Reserves';

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  v2pair,
  actualInput,
  actualOutput,
  limitPrice,
  marketPrice,
}: {
  isOpen: boolean;
  trade: Trade | undefined;
  originalTrade: Trade | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: number;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  onDismiss: () => void;
  v2pair?: [PairState, Pair | null];
  actualInput: string;
  actualOutput: string;
  limitPrice: string;
  marketPrice: string;
}) {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  );

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        actualInput={actualInput}
        actualOutput={actualOutput}
        limitPrice={limitPrice}
        marketPrice={marketPrice}
      />
    ) : null;
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade]);

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
      />
    ) : null;
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade]);

  const pendingContent = () => {
    return <></>;
  };

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Limit Order"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  );

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={''}
      pendingContent={pendingContent}
      trade={trade}
      v2pair={v2pair}
      isLimitPage={true}
    />
  );
}
