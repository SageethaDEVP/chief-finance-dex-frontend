import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FindIcon from '../../assets/svg-bid/search-normal.svg';
import { SearchInput } from '../../components/SearchModal/styleds';
import PoolsList from '../../components/pools/PoolsList';
import { PageWrap } from '../AppBody';
import { apiService } from '../../api/service';
import searchIco from '../../assets/images/search.png';
import Gs from 'theme/globalStyles';
import SwapHeader from 'components/swap/SwapHeader';
import { NavLink } from 'react-router-dom';
import resetIco from '../../assets/images/reset.png';
import chartIco from '../../assets/images/chartIco.png';
import Media from 'theme/media-breackpoint';
const Wrapper = styled.div`
  position: relative;
  max-width: 436px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
  `}
`;

const FlexAlign = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled(FlexAlign)`
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
`;

const CommonInputSection = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.newTheme.white};
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  border-radius: 12px;
`;

const InputSection = styled(CommonInputSection)`
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const Input = styled(SearchInput)`
  font-weight: 500;
  font-size: 14px;
`;

export interface HiddenPairsType {
  createdAt: string;
  id: string;
  isHide: boolean;
  token0: string;
  token1: string;
  updatedAt: string;
}

export default function Pools() {
  const [search, setSearch] = useState<string>('');
  const [hiddenPairs, setHiddenPairs] = useState<HiddenPairsType[]>([]);

  // const currencies = usePools();

  // const memoCurrencies = useMemo(() => {
  //   return currencies.filter(
  //     (currency) =>
  //       currency.symbol0?.toLowerCase().includes(search.toLowerCase()) ||
  //       currency.symbol1?.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [currencies, search]);

  const getPairs = async () => {
    const resp = await apiService.getListOfHiddenPairs();
    if (resp?.data) {
      setHiddenPairs(resp?.data);
    }
  };

  useEffect(() => {
    getPairs();
  }, []);

  return (
    <>
      <Gs.Container>
        {/* <SwapHeader /> */}
        <ExchangeBx>
          <ExchangeTop>
            <TabMain>
              <NavLink to={'/swap'}>Exchange</NavLink>
              <NavLink to={'/pool'} className="active">
                {' '}
                Pool
              </NavLink>
            </TabMain>
          </ExchangeTop>

          <Search>
            <img src={searchIco} alt="find" width={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              name=""
              placeholder="Search by Token"
            />
          </Search>
          <PoolsList search={search} hiddenPairs={hiddenPairs} />
        </ExchangeBx>
      </Gs.Container>
    </>
  );
}

//  NEW SCOMPONENTS

const ExchangeBx = styled.section`
  border: 1px solid #fff;
  border-radius: 30px;
  box-shadow: 4px 0px 6px 2px rgba(0, 0, 0, 0.04);
  width: 440px;
  /* min-height: 634px; */
  background: rgba(255, 255, 255, 0.4);
  margin: 0px auto;
  padding: 26px 30px;
  margin-top: 50px;
  max-width: 100%;
  margin-bottom: 50px;
  ${Media.xs} {
    padding: 18px 18px;
    border-radius: 20px;
    height: auto;
  }
`;
const Search = styled.div`
  width: 100%;
  position: relative;
  margin: 30px 0 0 0;
  img {
    position: absolute;
    right: 20px;
    top: 16px;
    filter: brightness(0);
  }
  input {
    height: 45px;
    width: 100%;
    border: 0px;
    background: #fff;
    border-radius: 10px;
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

// Top most part for the box
const ExchangeTop = styled.div`
    display: flex; align-items: center; margin-bottom: 19px;
    .rightBtns {width: 30px; height: 30px; background: #fff; border-radius: 3px; margin-left: 9px; display: flex; align-items: center; justify-content: center;
        img {width: 15px; height: 15px; object-fit: contain; transition: all 0.3s ease-in-out;}
        &:hover {background: var(--txtColor);
            img {filter: brightness(100);}
        }
`;

const TabMain = styled.div`
  border-radius: 10px;
  background: var(--bgLight2);
  width: 221px;
  height: 50px;
  display: flex;
  padding: 5px;
  margin-right: auto;
  a {
    width: 50%;
    font-weight: 500;
    border-radius: 10px;
    text-align: center;
    padding: 9px 0;
    &.active {
      background: #fff;
      box-shadow: 0px 0px 6px rgba(27, 193, 154, 0.07);
    }
  }
`;
