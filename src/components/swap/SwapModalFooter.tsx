import { Trade, TradeType } from '@bidelity/sdk';
import React, { useMemo, useState } from 'react';
import { Field } from '../../state/swap/actions';
import { TEXT } from '../../theme';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from '../../utils/prices';
import { ButtonError } from '../Button';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';
import RefreshIcon from '../../assets/svg-bid/refresh.svg';
import styled from 'styled-components';
import Media from 'theme/media-breackpoint';
import Gs from 'theme/globalStyles';

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
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <InfoSec>
        <p>
          Price
          <span>
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <img src={RefreshIcon} width="14px" height="14px" alt="refresh" />
            </StyledBalanceMaxMini>
          </span>
        </p>
        {/* <p>Maximum Sold <i><img width={20} src={InfoIco} /></i> <span>0.00003583 ETH</span></p> */}
        <p>
          {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          <span>
            {trade.tradeType === TradeType.EXACT_INPUT
              ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
              : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            -
            {trade.tradeType === TradeType.EXACT_INPUT
              ? trade.outputAmount.currency.symbol
              : trade.inputAmount.currency.symbol}
          </span>
        </p>

        <p>
          Price Impact
          <QuestionHelper text="The difference between the market price and your price due to trade size." />
          <div style={{ marginLeft: 'auto' }}>
            <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
          </div>
        </p>
        <p>
          Liquidity Provider Fee
          <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          <span>{realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}</span>
        </p>
      </InfoSec>

      <AutoRow>
        <ButtonError
          className="lg"
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, borderRadius: '8px' }}
          id="confirm-swap-or-send"
        >
          <TEXT.default fontSize={14} fontWeight={600} color="white">
            {severity > 2 ? 'Exchange Anyway' : 'Confirm Exchange'}
          </TEXT.default>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}

const InfoSec = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 15px 0 5px;
  p {
    display: flex;
    align-items: center;
    color: var(--txtColor);
    margin: 0 0 8px 0;
    i {
      margin-left: 4px;
    }
    a {
      vertical-align: top;
      display: inline-block;
      margin: 5px 0 0 8px;
    }
    span {
      margin-left: auto;
    }
  }
  ${Media.xs} {
    font-size: 14px;
  }
`;
