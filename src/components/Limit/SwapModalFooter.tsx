import { Trade } from '@bidelity/sdk';
import React from 'react';

import { TEXT } from '../../theme';

import { ButtonError } from '../Button';
import { AutoRow } from '../Row';
import {  SwapCallbackError } from './styleds';

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  
  

  return (
    <>
      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, borderRadius: '8px' }}
          id="confirm-swap-or-send"
        >
          <TEXT.default fontSize={14} fontWeight={600} color="white">
            {'Confirm Place an Order'}
          </TEXT.default>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
