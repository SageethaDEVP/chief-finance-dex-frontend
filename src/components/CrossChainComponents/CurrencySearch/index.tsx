/* eslint-disable react-hooks/exhaustive-deps */
import { Currency, ETHER, Token } from '@bidelity/sdk';
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import {
  useAllTokens,
  useToken,
  useIsUserAddedToken,
  useFoundOnInactiveList,
  useTokensFromMap,
} from '../../../hooks/Tokens';
import { TYPE, ButtonText, TEXT } from '../../../theme';
import { isAddress } from '../../../utils';
import Column from '../../Column';
import Row, { RowBetween, RowFixed } from '../../Row';
import CurrencyList from './CurrencyList';
import { filterTokens } from './filtering';
import { useTokenComparator } from './sorting';
import { PaddedColumn, SearchInput } from './styleds';
import styled from 'styled-components';
import useToggle from '../../../hooks/useToggle';
import useTheme from '../../../hooks/useTheme';
import CloseSvgIcon from '../../../assets/svg-bid/close-small.svg'; //assets/svg-bid/close-small.svg';
import cross from '../../../assets/images/cross.png';
import searchIco from '../../../assets/images/search.png';

import SearchIcon from '../../../assets/svg-bid/search-normal.svg';
import { apiService } from '../../../api/service';
import { TagInfo, WrappedTokenInfo, listToTokenMap } from 'state/lists/hooks';
import { TokenList } from '@uniswap/token-lists/dist/types';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { chain } from 'lodash';
import ImportRow from './ImportRow';
import { ButtonPrimary } from 'components/Button';
import { ethers } from 'ethers';
import Gs from 'theme/globalStyles';
import { ChainIds, EMPTY_LIST, TokenAddressMap } from '../../../constants';

const ContentWrapper = styled(Column)`
  width: 100%;
  position: relative;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.newTheme.white}; ;
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 0;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const HeaderSection = styled(RowBetween)`
  position: relative;
  justify-content: center;
`;

const Search = styled.div`
  width: 100%;
  position: relative;
  margin: 30px 0 0 0;
  img {
    position: absolute;
    right: 20px;
    top: 12px;
  }
  input {
    height: 40px;
    width: 100%;
    border: 0px;
    background: var(--bgLight2);
    border-radius: 5px;
    color: var(--txtColor);
    font-family: var(--font);
    padding: 0 40px 2px 20px;
    border: 1px solid var(--bgLight2);
    transition: all 0.3s ease-in-out;
    line-height: 1;
    &:focus {
      border: 1px solid var(--primary);
    }
    ::-ms-input-placeholder {
      /* Edge 12-18 */
      color: var(--txtLight2);
    }
    ::placeholder {
      color: var(--txtLight2);
    }
  }
`;
const SearchSection = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 10px;
`;

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  chainId: number;
}

interface TokenFromInactiveList {
  address: string;
  createdAt: string;
  decimal: number;
  id: string;
  isActive: boolean;
  name: string;
  symbol: string;
  updatedAt: string;
}

const IRRELEVANT_ID = '05031f15-32f1-402d-9e85-e61028cd864c';

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
  chainId,
}: CurrencySearchProps) {
  const theme = useTheme();

  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [invertSearchOrder] = useState<boolean>(false);

  const [listHeight, setListHeight] = useState<number>(384);

  const [inactiveTokensList, setInactiveTokensList] = useState<TokenFromInactiveList[]>([]);

  const allTokens = useAllTokens();
  // const inactiveTokens: Token[] | undefined = useFoundOnInactiveList(searchQuery)

  // if they input an address, use it
  const searchToken = useToken(searchQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    return s === '' || s === 'e' || s === 'et' || s === 'eth';
  }, [searchQuery]);

  //function to filter according to chain id

  const listCache: WeakMap<TokenList, TokenAddressMap> | null =
    typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null;
  function listToTokenMap(list: TokenList): TokenAddressMap {
    const result = listCache?.get(list);
    if (result) return result;
    const map = list.tokens.reduce<TokenAddressMap>(
      (tokenMap, tokenInfo) => {
        const tags: TagInfo[] =
          tokenInfo.tags
            ?.map((tagId) => {
              if (!list.tags?.[tagId]) return undefined;
              return { ...list.tags[tagId], id: tagId };
            })
            ?.filter((x): x is TagInfo => Boolean(x)) ?? [];
        const token = new WrappedTokenInfo(tokenInfo, tags);
        if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.');
        return {
          ...tokenMap,
          [token.chainId]: {
            ...tokenMap[token.chainId],
            [token.address]: {
              token,
              list: list,
            },
          },
        };
      },
      { ...EMPTY_LIST }
    );
    listCache?.set(list, map);
    // console.log('here 1', map);
    return map;
  }

  function useTokensFromMap(tokenMap: TokenAddressMap, chainId: ChainIds): { [address: string]: Token } {
    return useMemo(() => {
      if (!chainId) return {};
      // reduce to just tokens
      const mapWithoutUrls = Object.keys(tokenMap[chainId])?.reduce<{ [address: string]: Token }>((newMap, address) => {
        newMap[address] = tokenMap[chainId][address]?.token;
        return newMap;
      }, {});

      return mapWithoutUrls;
    }, [chainId, tokenMap]);
  }

  const tokenAddresses = {
    name: 'Uniswap Default List',
    timestamp: '2021-01-21T23:57:10.982Z',
    version: {
      major: 2,
      minor: 0,
      patch: 0,
    },
    tags: {},
    logoURI: 'ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir',
    keywords: ['uniswap', 'default'],
    tokens: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 97,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'BINANCE',
        symbol: 'BNB',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 80002,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'AMOY',
        symbol: 'MATIC',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 43113,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'AVALANCE',
        symbol: 'AVAX',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 11155420,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'OPTIMISM',
        symbol: 'OPT',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 59141,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'LINEA',
        symbol: 'LINEAETH',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 44787,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'CELO',
        symbol: 'CELO',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 84532,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'BASE',
        symbol: 'ETHER',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 168587773,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'BLAST',
        symbol: 'ETHER',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 1313161555,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'AURORA',
        symbol: 'ETHER',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 534351,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'SCROLL',
        symbol: 'ETHER',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 1287,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'MOONBASE',
        symbol: 'DEV',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 421614,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'ARBITRUM',
        symbol: 'ARB',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 421614,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'ARBITRUM',
        symbol: 'ARB',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 4002,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'FANTOM',
        symbol: 'FTM',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 4002,
        decimals: 18,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        name: 'FANTOM',
        symbol: 'FTM',
      },
      {
        address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
        chainId: 1,
        decimals: 18,
        logoURI: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_ZRX.svg',
        name: '0x Protocol Token',
        symbol: 'ZRX',
      },
      {
        chainId: 11155111,
        address: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
        name: 'aUSDC',
        symbol: 'aUSDC',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 11155111,
        decimals: 18,
        logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
        name: 'Sepolia ETH',
        symbol: 'ETH',
      },
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: 97,
        decimals: 18,
        logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
        name: 'Binance',
        symbol: 'BNB',
      },
      {
        chainId: 97,
        address: '0x510601cb8Db1fD794DCE6186078b27A5e2944Ad6',
        name: 'MDT',
        symbol: 'MDT',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
      },
      // {
      //   chainId: 97,
      //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
      //   name: 'USDT',
      //   symbol: 'USDT',
      //   decimals: 6,
      //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
      // },
      // {
      //   chainId: 97,
      //   address: '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
      //   name: 'USDT',
      //   symbol: 'USDT',
      //   decimals: 6,
      //   logoURI: 'https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397',
      // },
    ],
  };

  const filteredTokenAddresses = tokenAddresses?.tokens?.filter((token) => token?.chainId == chainId);
  tokenAddresses.tokens = filteredTokenAddresses;
  const listmine = listToTokenMap(tokenAddresses);
  const newList = Object.values(useTokensFromMap(listmine, chainId));

  const tokenComparator = useTokenComparator(invertSearchOrder);

  interface ExtendedToken extends Token {
    equals: (other: ExtendedToken) => boolean;
    sortsBefore: (other: ExtendedToken) => boolean;
  }
  // Filter by our TokenAddresses aray
  const filteredTokens: ExtendedToken[] = useMemo(() => {
    const initiallyFilteredTokens = filterTokens(newList as unknown as ExtendedToken[], searchQuery);
    const inactiveAddressArray: string[] = inactiveTokensList
      .filter((t) => t.id !== IRRELEVANT_ID)
      .map((token) => token.address.toUpperCase());

    return initiallyFilteredTokens.filter((token) => !inactiveAddressArray.includes(token.address.toUpperCase()));
  }, [tokenAddresses.tokens, searchQuery, inactiveTokensList]);

  const filteredSortedTokens: Token[] = useMemo(() => {
    const sorted = filteredTokens.sort(tokenComparator);
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    if (symbolMatch.length > 1) {
      return sorted;
    }

    return [
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),

      // sort by tokens whos symbols start with search substrng
      ...sorted.filter(
        (token) =>
          token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim()) &&
          token.symbol?.toLowerCase() !== symbolMatch[0]
      ),

      // rest that dont match upove
      ...sorted.filter(
        (token) =>
          !token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim()) &&
          token.symbol?.toLowerCase() !== symbolMatch[0]
      ),
    ];
  }, [filteredTokens, searchQuery, tokenComparator]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onCurrencySelect, onDismiss]
  );
  const getInactiveTokensList = async () => {
    const response = await apiService.getListOfInactiveTokens();
    setInactiveTokensList(response?.data);
  };

  useEffect(() => {
    getInactiveTokensList();
  }, []);

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        if (s === 'eth') {
          handleCurrencySelect(ETHER);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, isOpen ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const [showExpanded, setShowExpanded] = useState(false);
  const inactiveTokens = useFoundOnInactiveList(searchQuery);

  const callbackRef = (element: HTMLDivElement) => {
    if (!element) return;

    const modalHeight = element?.getBoundingClientRect().height;

    if (modalHeight >= 576) {
      setListHeight(384);
    } else if (modalHeight >= 513) {
      setListHeight(392);
    } else {
      setListHeight(336);
    }
  };

  return (
    <Gs.PopupMain ref={callbackRef}>
      <Gs.OverLay onClick={onDismiss} />
      <Gs.Popup className="hasBorderBtm">
        <h3>
          Select a token
          <a onClick={() => onDismiss()} className="close">
            <img src={cross} width={12} alt="close" />
          </a>
        </h3>
        <Search>
          <img src={searchIco} alt="searchIco" width={15} />
          <input
            type="text"
            name=""
            id="token-search-input"
            placeholder="Search"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Search>
        {searchToken && !searchTokenIsAdded ? (
          <Column style={{ padding: '20px 0', height: '100%' }}>
            <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
          </Column>
        ) : filteredSortedTokens?.length > 0 || (showExpanded && inactiveTokens && inactiveTokens.length > 0) ? (
          <>
            <CurrencyList
              height={listHeight}
              showETH={showETH}
              // currencies={newList}
              currencies={
                showExpanded && inactiveTokens ? filteredSortedTokens.concat(inactiveTokens) : filteredSortedTokens
              }
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
              showImportView={showImportView}
              setImportToken={setImportToken}
              chainId={chainId}
            />
          </>
        ) : (
          <Column style={{ padding: '20px 20px 40px', height: `${listHeight}px` }}>
            <TYPE.main color={theme.text3} textAlign="center" mb="20px">
              No results found.
            </TYPE.main>
            {inactiveTokens &&
              inactiveTokens.length > 0 &&
              !(searchToken && !searchTokenIsAdded) &&
              searchQuery.length > 1 &&
              filteredSortedTokens?.length === 0 && (
                <Row align="center" width="100%" justify="center">
                  <ButtonPrimary
                    width="fit-content"
                    borderRadius="12px"
                    padding="8px 12px"
                    onClick={() => setShowExpanded(!showExpanded)}
                  >
                    {!showExpanded
                      ? `Show ${inactiveTokens.length} more inactive ${
                          inactiveTokens.length === 1 ? 'token' : 'tokens'
                        }`
                      : 'Hide expanded search'}
                  </ButtonPrimary>
                </Row>
              )}
          </Column>
        )}
      </Gs.Popup>
    </Gs.PopupMain>
  );
}
