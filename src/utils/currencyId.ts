import { Currency, ETHER, Token } from '@bidelity/sdk';
import { nativeSymbol } from '../constants';
import { ChainId } from 'constants/contractConstants';
// import { ChainId } from 'constants';

export function currencyId(currency: Currency, chainId: ChainId): string {
  if (currency === ETHER) return nativeSymbol[chainId ? chainId : 1];
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}
