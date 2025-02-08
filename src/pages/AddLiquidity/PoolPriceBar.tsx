import { Currency, Percent, Price } from '@bidelity/sdk';
import React from 'react';
import { AutoColumn } from '../../components/Column';
import { RowBetween } from '../../components/Row';
import { ONE_BIPS } from '../../constants';
import { Field } from '../../state/mint/actions';
import { TEXT } from '../../theme';

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
}) {
  return (
    <>
      <p>
        {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
        <span>{price?.toSignificant(6) ?? '-'}</span>
      </p>

      <p>
        {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
        <span>{price?.invert()?.toSignificant(6) ?? '-'}</span>
      </p>

      <p>
        Share of Pool
        <span>
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </span>
      </p>
    </>
  );
}
