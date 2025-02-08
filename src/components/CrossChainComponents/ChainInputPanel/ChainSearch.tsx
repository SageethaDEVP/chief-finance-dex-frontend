import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TEXT } from '../../../theme';
import Column from '../../Column';
import { RowBetween } from '../../Row';
import { PaddedColumn, SearchInput } from '../../SearchModal/styleds';
import styled from 'styled-components';
import useToggle from 'hooks/useToggle';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import useTheme from 'hooks/useTheme';
import CloseSvgIcon from '../../../assets/svg-bid/close-small.svg';
import cross from '../../../assets/images/cross.png';

import { ChainList, Lists } from 'components/CrossChainComponents/StyledComponents/ChainModalList';
import SearchIcon from '../../../assets/svg-bid/search-normal.svg';
import searchIco from '../../../assets/images/search.png';

import { Chain } from '../CCHooks/types';
import Gs from 'theme/globalStyles';
import { Flex } from 'rebass';
import { chains } from '../../../constants';
const ContentWrapper = styled(Column)`
  width: 100%;
  position: relative;
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

interface ChainSearchProps {
  isOpen: boolean;
  onDismiss: (diss: boolean) => void;
  selectedChain: Chain;
  otherSelectedChain: Chain;
  setChain: (chain: Chain) => void;
}

const IRRELEVANT_ID = '05031f15-32f1-402d-9e85-e61028cd864c';

export function ChainSearch({ onDismiss, isOpen, selectedChain, otherSelectedChain, setChain }: ChainSearchProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredChains, setFilteredChains] = useState<Chain[]>(chains);

  const [error, setError] = useState<string | null>(null);

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase().trim();
      setSearchQuery(query);

      const filteredChains = chains.filter(
        (chain) => chain.name.toLowerCase().includes(query) || chain.symbol.toLowerCase().includes(query)
      );

      if (filteredChains.length > 0) {
        setFilteredChains(filteredChains);
        setError(null);
      } else {
        setError('No results found.');
      }
    },
    [setSearchQuery, chains, setFilteredChains]
  );

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactiv

  const callbackRef = (element: HTMLDivElement) => {
    if (!element) return;

    const modalHeight = element?.getBoundingClientRect().height;

    // if (modalHeight >= 576) {
    //   setListHeight(448);
    // } else if (modalHeight >= 513) {
    //   setListHeight(392);
    // } else {
    //   setListHeight(336);
    // }
  };

  const handleSelectChain = (index: number) => {
    onDismiss(false);
    setChain(chains[index]);
    setChain(filteredChains[index]);
  };
  return (
    <Gs.PopupMain ref={callbackRef}>
      <Gs.OverLay onClick={() => onDismiss(false)} />

      <Gs.Popup className="hasBorderBtm">
        <h3>
          Select a Chain
          <a onClick={() => onDismiss(false)} className="close">
            <img width={12} src={cross} alt="close" />
          </a>
        </h3>
        <Search>
          <Icon src={searchIco} alt="search" width={15} />
          <input
            type="text"
            name=""
            id="token-search-input"
            placeholder="Search"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('Enter key pressed');
              }
            }}
          />
        </Search>
        {error ? (
          <p style={{ fontWeight: '500', color: '#888D9B', display: 'Flex', justifyContent: 'center' }}>{error}</p>
        ) : (
          filteredChains.map((option, index) => (
            // eslint-disable-next-line react/jsx-key
            <TokenList onClick={() => handleSelectChain(index)}>
              <Lists
                className="tlLeft"
                key={index}
                onClick={() => handleSelectChain(index)}
                disabled={otherSelectedChain && otherSelectedChain.chainId === option.chainId}
              >
                <>
                  <img src={option.logoURI} width="50" height="50" />
                  {option?.name}
                </>
              </Lists>
            </TokenList>
          ))
        )}
      </Gs.Popup>
    </Gs.PopupMain>
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
    margin-bottom: 10px;
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
