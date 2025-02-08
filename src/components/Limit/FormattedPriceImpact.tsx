import { Percent } from '@bidelity/sdk';
import React from 'react';
import { ONE_BIPS } from '../../constants';
import { warningSeverity } from '../../utils/prices';
import { ErrorText } from './styleds';
import { TEXT } from '../../theme';

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  return (
    <ErrorText fontWeight={500} fontSize={14} severity={warningSeverity(priceImpact)}>
      <TEXT.default fontSize={12} fontWeight={600} color="primary1" lineHeight="20.4px">
        {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
      </TEXT.default>
    </ErrorText>
  );
}
