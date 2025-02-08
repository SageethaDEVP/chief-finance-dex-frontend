import { Trade } from '@bidelity/sdk';
import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';


import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { RowFlat,RowBetween } from '../Row';

import ArrowRightIcon from '../../assets/svg-bid/arrow-right-grey.svg';
import TickCircleIcon from '../../assets/svg-bid/tick-circle.svg';
import WarningIcon from '../../assets/svg-bid/warning.svg';

import { ColorsNewTheme } from '../../theme/styled';

const InfoWrapper = styled.div`
  display:flex;
  flex-direction:row;
  margin-bottom: 6px;
`;

const FlexWithAlign = styled.div`
  display: flex;
  align-items: center;
`;

const InfoRow = styled(FlexWithAlign)`
  flex-grow:3;
  display:flex;
  flex-direction:column;
`;

const AmountInfo = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ArrowWrapper = styled(FlexWithAlign)`
  flex:0;
  justify-content: center;
  margin-right:6px;
  img {
    width: 20px;
    height: 20px;
  }
`;
const ColoredWrapper = styled.div<{ bgColor: keyof ColorsNewTheme }>`
  background-color: ${({ bgColor, theme }) => (theme.newTheme as any)[bgColor]};;
  border-radius: 8px;
  padding: 10px;
`
export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  actualInput,
  actualOutput,
  limitPrice,
  marketPrice
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
  actualInput:string|undefined;
  actualOutput:string|undefined;
  limitPrice:string;
  marketPrice:string;
}) {

  return (
    <AutoColumn gap={'md'}>
      <InfoWrapper>
        <InfoRowItem trade={trade} amount={actualInput} field="inputAmount" />
        <ArrowWrapper>
          <img src={ArrowRightIcon} alt="arrow" />
        </ArrowWrapper>
        <InfoRowItem trade={trade} amount={actualOutput}  field="outputAmount" direction="To" />
      </InfoWrapper>
      <ColoredWrapper bgColor="bg2">
        <RowBetween>
          <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
              Current Market Price
          </TEXT.default>
          <RowFlat>
            <TEXT.default fontWeight={600} fontSize={14} color="textPrimary">
              1 {trade["inputAmount"].currency.symbol} = {marketPrice!=""?(Number(marketPrice).toPrecision(6)):""} {trade["outputAmount"].currency.symbol}
            </TEXT.default>
          </RowFlat>
        </RowBetween>
        <RowBetween style={{paddingTop:'5px'}}>
          <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
          </TEXT.default>
          <RowFlat>
            <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
              1 {trade["outputAmount"].currency.symbol} = {marketPrice!=""?(1/Number(marketPrice)).toPrecision(6):""} {trade["inputAmount"].currency.symbol}
            </TEXT.default>
          </RowFlat>
        </RowBetween>

        <RowBetween style={{paddingTop:'5px'}}>
          <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
              Limit Price
          </TEXT.default>
          <RowFlat>
            <TEXT.default fontWeight={600} fontSize={14} color="textPrimary">
              1 {trade["inputAmount"].currency.symbol} = {limitPrice!=""?Number(limitPrice).toPrecision(6):""} {trade["outputAmount"].currency.symbol}
            </TEXT.default>
          </RowFlat>
        </RowBetween>
        <RowBetween style={{paddingTop:'5px'}}>
          <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
          </TEXT.default>
          <RowFlat>
            <TEXT.default fontWeight={600} fontSize={14} color="textSecondary">
              1 {trade["outputAmount"].currency.symbol} = {limitPrice!=""?(1/Number(limitPrice)).toPrecision(6):""} {trade["inputAmount"].currency.symbol}
            </TEXT.default>
          </RowFlat>
        </RowBetween>
      </ColoredWrapper>
      <ColoredWrapper  bgColor="bg9">
        <div style={{position:"relative"}}>
          <ArrowWrapper style={{position:"absolute",top:"0"}}>
            <img src={TickCircleIcon} alt="arrow" />
          </ArrowWrapper>
          <TEXT.default fontWeight={500} fontSize={12} color="primary1" style={{paddingLeft:"35px"}}>
                Limit price is {marketPrice!=""?(100*(Number(limitPrice)-Number(marketPrice))/Number(marketPrice)).toFixed(2):""}% above the current market
                rate. The order will be executed when the market
                price reaches high enough above your limit price
                (to also pay for limit order execution gas fees).
          </TEXT.default>
        </div>
      </ColoredWrapper>
      <ColoredWrapper  bgColor="bg10">
        <RowBetween>
          <ArrowWrapper>
            <img src={WarningIcon} alt="arrow" />
          </ArrowWrapper>
          <TEXT.default fontWeight={500} fontSize={16} color="text6"  style={{flex:"auto"}}>
            Real Execution Price:
          </TEXT.default>
        </RowBetween>
        <TEXT.default fontWeight={500} fontSize={12} color="text6">
          &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;Your execution gas fees are paid for by the spread between your specified price and thу real execution price.
        </TEXT.default>
        <TEXT.default fontWeight={500} fontSize={12} color="text6">
          &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;Gas fees volatile and thus the exact market price st which your order will execute is.unpredictable.
        </TEXT.default>
        <TEXT.default fontWeight={500} fontSize={12} color="text6">
          &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;It might take much longer than you expected to reach the price that fills your order + fees.
        </TEXT.default>
        
        <TEXT.default fontWeight={500} fontSize={16} color="text6" style={{marginTop:'10px'}}>
          “Fee on Transfer” Tokens
        </TEXT.default>
        <TEXT.default fontWeight={500} fontSize={12} color="text6">
          &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;“Fee on transfer" tokens should not be used. with Limit Orders.
        </TEXT.default>
      </ColoredWrapper>
    </AutoColumn>
  );
}

const InfoRowItem = ({
  trade,
  field,
  direction = 'From',
  amount
}: {
  trade: Trade;
  field: 'inputAmount' | 'outputAmount';
  direction?: 'From' | 'To';
  amount:string|undefined
}) => {
  return (
    <InfoRow>
      <AmountInfo>
        <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" style={{textAlign:direction=="To"?'right':'left'}}>
          {amount ? Number(amount).toPrecision(6):""}
        </TEXT.default>
      </AmountInfo>
      <div style={{'display':'flex','width':'100%'}}>
        <TEXT.default fontWeight={600} fontSize={14} color="textPrimary" marginTop="4px" style={{textAlign:direction=="To"?'right':'left',flex:direction=="To"?'1':''}}>
          {trade[field].currency.symbol}
        </TEXT.default>
        <CurrencyLogo currency={trade[field].currency} size={'20px'} style={{ marginLeft: '5px' }} />
      </div>
    </InfoRow>
  );
};
