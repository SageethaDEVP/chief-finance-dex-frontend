import { Trade, TradeType } from '@bidelity/sdk';
import React, { useMemo } from 'react';
import { AlertTriangle } from 'react-feather';
import styled from 'styled-components';
import { Field } from '../../state/swap/actions';
import { TEXT, TYPE } from '../../theme';
import { ButtonPrimary } from '../Button';
import { isAddress, shortenAddress } from '../../utils';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { RowBetween, RowFixed } from '../Row';
import { SwapShowAcceptChanges } from './styleds';
import ArrowDownIcon from '../../assets/svg-bid/arrow-down-in-circle.svg';
import VectorDonIcon from '../../assets/svg-bid/vector-down.svg';
import Media from 'theme/media-breackpoint';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/arrow2.png';
import Swap from '../../assets/images/swap.png';

// OLD SCOMPONENTS
const InfoWrapper = styled.div`
  padding: 16px;
  margin-bottom: 6px;
`;

const FlexWithAlign = styled.div`
  display: flex;
  align-items: center;
`;

const InfoRow = styled(FlexWithAlign)`
  padding: 8px;
  border-radius: 14px;
  max-width: 313px;
  background-color: ${({ theme }) => theme.newTheme.bg2}};
`;

const AmountInfo = styled.div`
  padding: 18px 16px;
  margin-left: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.newTheme.white};
  width: 100%;
  overflow: hidden;
`;

const ArrowWrapper = styled(FlexWithAlign)`
  justify-content: center;
  margin: 6px 0;
  img {
    width: 26px;
    height: 24px;
  }
`;

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );

  return (
    <>
      <InfoRowItem trade={trade} field="inputAmount" />
      <Switch>
        <a className="switch">
          <img src={Swap} alt="Swap" />
        </a>
      </Switch>

      <InfoRowItem trade={trade} field="outputAmount" direction="To" />
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '9px', minWidth: 24, color: '#FFA51E' }} />
              <TEXT.default fontWeight={500} fontSize={14} color="textPrimary">
                {' '}
                Price Updated
              </TEXT.default>
            </RowFixed>
            <ButtonPrimary
              style={{
                padding: '6px 20px',
                width: 'fit-content',
                fontWeight: 600,
                fontSize: '12px',
                borderRadius: '8px',
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}

      {trade.tradeType === TradeType.EXACT_INPUT ? (
        <Msg>
          {`Output is estimated. You will receive at least `}
          <span>
            {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
          </span>
          {' or the transaction will revert.'}
        </Msg>
      ) : (
        <Msg>
          {`Input is estimated. You will sell at most `}
          <span>
            {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
          </span>
          {' or the transaction will revert.'}
        </Msg>
      )}
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </>
  );
}

const InfoRowItem = ({
  trade,
  field,
  direction = 'From',
}: {
  trade: Trade;
  field: 'inputAmount' | 'outputAmount';
  direction?: 'From' | 'To';
}) => {
  return (
    <>
      <ExBox>
        <div className="input-container">
          <input type="type" id="yousend" className="" value={trade[field].toSignificant(6)} name="" />
        </div>
        <DropSelect className="ExBox-right">
          <div
            style={{
              boxSizing: 'border-box',
              color: '#1A203F',
              marginBottom: '5px',
              fontWeight: 600,
              fontSize: '10px',
            }}
          >
            {direction}{' '}
          </div>
          <a className="selectBtn">
            <CurrencyLogo currency={trade[field].currency} size={'26px'} style={{ marginRight: '8px' }} />
            <span>{trade[field].currency.symbol}</span>
          </a>
        </DropSelect>
      </ExBox>
    </>
  );
};

// NEW SCOMPONENTS

const ExBox = styled.div`
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  background: var(--bgLight);
  padding: 12px 12px;
  &:focus-within {
    box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.16);
  }
  .input-container {
    position: relative;
    border-right: 1px solid #abd0d9;
    width: 190px;
    input {
      border: 0px;
      font-size: 24px;
      background: none;
      color: var(--txtLight);
      font-family: var(--font);
      height: 40px;
      width: 100%;
      font-weight: 600;
      ::-ms-input-placeholder {
        /* Edge 12-18 */
        color: var(--txtLight2);
      }
      ::placeholder {
        color: var(--txtLight2);
      }
    }
    label {
      font-size: 12px;
      color: var(--txtLight2);
      position: absolute;
      padding: 0 0;
      top: 25px;
      left: 0;
    }
    b {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      position: absolute;
      top: 0;
      right: 17px;
      cursor: pointer;
    }
  }
  ${Media.xs} {
    .input-container {
      width: 100%;
      input {
        font-size: 20px;
        padding: 0 45px 20px 0;
      }
      b {
        right: 8px;
      }
    }
  }
`;

const DropSelect = styled.div`
  width: 83px;
  flex-shrink: 0;
  align-self: center;
  margin-right: 0;
  margin-left: auto;
  .selectBtn {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 2px;
    width: 100%;
    border-radius: 30px;
    padding: 0 12px 0 0;
    height: 19px;
    background: #fff;
    width: 84px;
    .token {
      margin-right: 9px;
      width: 28px;
      height: 28px;
      width: 12px;
      height: 12px;
      transform: scale(2);
    }
    span {
      margin: 0 5px 0 auto;
    }
    .arrow {
      margin-left: auto;
      width: 7px;
      flex-shrink: 0;
      position: relative;
    }
  }
`;
const Switch = styled.div`
  display: block;
  text-align: center;
  margin: 0 0 10px 0;
  a {
    width: 50px;
    height: 50px;
    background: var(--primary);
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out 0s;
    cursor: pointer;
    z-index: 1;
    position: relative;
    top: 0;
    box-shadow: 0 0 13px rgba(27, 202, 161, 0.6);
    img {
      filter: brightness(100);
    }
    &:hover {
      transform: rotate(180deg);
      box-shadow: 0 0 0 5px rgba(27, 193, 154, 0.2);
    }
  }
`;

const Msg = styled.div`
  color: var(--txtColor);
  font-weight: 500;
  text-align: center;
  font-size: 15px;
  line-height: 1.6;
  margin: 22px 0 0 0;
  span {
    color: var(--primary);
  }
`;
