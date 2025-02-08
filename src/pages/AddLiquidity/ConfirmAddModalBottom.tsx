import { Currency, CurrencyAmount, Percent, Fraction } from '@bidelity/sdk';
import React from 'react';
import CurrencyLogo from '../../components/CurrencyLogo';
import { Field } from '../../state/mint/actions';
import { TEXT } from '../../theme';
import styled from 'styled-components';
import { AutoColumn } from '../../components/Column';
import { FlexAlign } from '../Pool/styleds';
import { ButtonPrimary } from '../../components/Button';

const Wrapper = styled.div`
  margin-top: 18px;
`;

const Button = styled(ButtonPrimary)`
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 4px;
`;

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  return (
    <Wrapper>
      <AutoColumn gap="16px">
        <AutoColumn gap="6px">
          <TEXT.secondary fontWeight={500} fontSize={12}>
            {currencies[Field.CURRENCY_A]?.symbol} Deposited
          </TEXT.secondary>
          <FlexAlign>
            <CurrencyLogo size="26px" currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <TEXT.primary fontSize={14} fontWeight={600}>
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
            </TEXT.primary>
          </FlexAlign>
        </AutoColumn>

        <AutoColumn gap="6px">
          <TEXT.secondary fontWeight={500} fontSize={12}>
            {currencies[Field.CURRENCY_B]?.symbol} Deposited
          </TEXT.secondary>
          <FlexAlign>
            <CurrencyLogo size="26px" currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <TEXT.primary fontSize={14} fontWeight={600}>
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
            </TEXT.primary>
          </FlexAlign>
        </AutoColumn>

        <AutoColumn gap="6px">
          <TEXT.secondary fontWeight={500} fontSize={12}>
            Rates
          </TEXT.secondary>
          <TEXT.primary fontSize={14} fontWeight={600}>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </TEXT.primary>
          <TEXT.primary fontSize={14} fontWeight={600}>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </TEXT.primary>
        </AutoColumn>

        <AutoColumn gap="6px">
          <TEXT.secondary fontWeight={500} fontSize={12}>
            Share of Pool:
          </TEXT.secondary>
          <TEXT.primary fontSize={14} fontWeight={600}>
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </TEXT.primary>
        </AutoColumn>
        <Button onClick={onAdd}>Confirm Supply</Button>
      </AutoColumn>
    </Wrapper>
  );
}
