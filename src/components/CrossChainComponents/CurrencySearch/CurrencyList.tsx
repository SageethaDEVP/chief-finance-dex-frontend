import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@bidelity/sdk';
import React, { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Text } from 'rebass';
import styled from 'styled-components';
import { useActiveWeb3React } from '../../../hooks';
import { WrappedTokenInfo, useCombinedActiveList } from '../../../state/lists/hooks';
import { TEXT } from '../../../theme';
import { useIsUserAddedToken, useAllInactiveTokens } from '../../../hooks/Tokens';
import Column from '../../Column';
import { RowFixed } from '../../Row';
import CurrencyLogo from '../../CurrencyLogo';
import { MouseoverTooltip } from '../../Tooltip';
import Loader from '../../Loader';
import { isAddress, isTokenOnList } from '../../../utils';
import ImportRow from './ImportRow';
import { wrappedCurrency } from '../../../../src/utils/wrappedCurrency'; //utils/wrappedCurrency';
import { fetchBalances } from '../../CrossChainComponents/TokenBalances';
import { MenuItem } from '../CurrencySearch/styleds';

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : '';
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>;
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  balance,
}: {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
  balance: string;
}) {
  const { account } = useActiveWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  const customAdded = useIsUserAddedToken(currency);

  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <TokenList>
        <div className="tlLeft">
          <CurrencyLogo currency={currency} size={'33px'} />
          <p>
            {currency.symbol}
            <span> {currency.name}</span>
          </p>
          <TEXT.default ml="0px" fontSize={12} fontWeight={500} color="textSecondary" marginLeft={'20px'}>
            {!isOnSelectedList && customAdded && '• Added by user'}
          </TEXT.default>
        </div>

        <div className="val">
          {balance ? (
            <StyledBalanceText title={`${balance}`}>{balance}</StyledBalanceText>
          ) : account ? (
            <Loader />
          ) : null}
        </div>
      </TokenList>
      <TokenTags currency={currency} />
    </MenuItem>
  );
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  chainId,
}: {
  height: number;
  currencies: Currency[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showETH: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  chainId: number;
}) {
  const itemData = useMemo(() => currencies, [currencies]);
  const [tokenBalances, setTokenBalances] = useState<any>([]);

  // console.log('list2 item data', itemData[0].address);
  const { account } = useActiveWeb3React();
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies]
  );
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  );

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index];
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency));
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency));
      const handleSelect = () => onCurrencySelect(currency);

      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
          balance={tokenBalances?.[data[index].address]}
        />
      );
      // }
    },
    [tokenBalances, onCurrencySelect, otherCurrency, selectedCurrency]
  );

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), []);
  useEffect(() => {
    // Fetch token balances when the component mounts or when token addresses change
    const fetchCurrentBalances = async () => {
      if (account && validatedTokens.length > 0) {
        try {
          const balances = await fetchBalances(validatedTokens, account, chainId);
          setTokenBalances(balances);
        } catch (error) {
          console.error('Error fetching token balances:', error);
        }
      }
    };

    fetchCurrentBalances();
  }, [account, validatedTokens]);

  // fetchBalances(tokenAddresses);
  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
      style={{ paddingBottom: 56 }}
    >
      {Row}
    </FixedSizeList>
  );
}

const TokenList = styled.li`
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 8px 11px;
  background: none;
  width: calc(100% - 10px);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  .tlLeft {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
      flex-shrink: 0;
      margin-right: 8px;
    }
    p {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #000;
      line-height: 1;
      span {
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: var(--txtLight2);
      }
    }
  }
  .val {
    color: #000;
    font-size: 18px;
    margin-left: auto;
    font-weight: 500;
  }
  &:hover {
    background: var(--bgLight2);
    border: 1px solid var(--primary);
  }
`;
