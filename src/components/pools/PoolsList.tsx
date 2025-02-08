import { useQuery } from '@apollo/client';
import { PAIRS_VOLUME, PAIRS_VOLUME_BIDELITY, PairVolumeQueryResult } from 'pages/Pools/query';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ArrowRightBlue from '../../assets/svg-bid/arrow-right-blue.svg';
import { TEXT, TYPE } from '../../theme';
import PoolsListRow from './PoolsListRow';
import { HiddenPairsType } from '../../pages/Pools';
import { useLocation } from 'react-router-dom';

import Gs from '../../theme/globalStyles';
import Eth from '../assets/images/eth.png';
import chartIco2 from '../../assets/images/chartIco2.png';
import Question from '../../assets/images/question.png';
import arrowLeft from '../../assets/images/arrowLeft.png';
import arrowRight from '../../assets/images/arrowRight.png';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/arrow2.png';
import Swap from '../../assets/images/swap.png';
import Media from 'theme/media-breackpoint';
import { useActiveWeb3React } from 'hooks';
const FlexAlign = styled.div`
  display: flex;
  align-items: center;
`;

const PoolsListSection = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.white};
  padding: 24px;
  margin-top: 20px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
`;

const PoolsListFooter = styled(FlexAlign)`
  justify-content: center;
  padding: 14px 16px;
`;
const BottomTextWrapper = styled.div`
  margin: 0 10px;
`;
const PoolsListBody = styled.div`
  margin-top: 16px;
  width: 100%;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  overflow: hidden;
`;

const PoolsListItem = styled(FlexAlign)`
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.newTheme.border3};
`;

const ListHeaderItem = styled.div<{ isFull: string }>`
  display: flex;
  justify-content: ${({ isFull }) => (isFull === 'true' ? 'space-between' : 'flex-end')};
`;

const IconRight = styled.div`
  cursor: pointer;
  margin-top: 3px;
  img {
    width: 24px;
    height: 24px;
  }
`;

const IconLeft = styled(IconRight)`
  transform: rotate(180deg);
  margin-top: -5px;
`;

const LIMIT = 8;

export default function PoolsList({ search, hiddenPairs }: { search: string; hiddenPairs: HiddenPairsType[] }) {
  const [page, setPage] = useState<number>(1);
  const location = useLocation();

  const isBidelity = location.pathname === '/pools:list';

  const QUERY = isBidelity ? PAIRS_VOLUME_BIDELITY : PAIRS_VOLUME;
  const endpoint = isBidelity ? 'endpoint2' : 'endpoint1';
  const { chainId } = useActiveWeb3React();
  const { data, loading, refetch } = useQuery<PairVolumeQueryResult>(QUERY, {
    context: { clientName: chainId },
  });
  useEffect(() => {
    refetch();
  }, [chainId]);

  const pairsWithHiddenRemoved = useMemo(() => {
    if (!data) return [];
    return data.pairDayDatas.filter((item) => {
      const hiddenPair = hiddenPairs.find((pair) => pair.token0 === item.token0.id);
      if (!hiddenPair) return true;
      return hiddenPair.token1 !== item.token1.id;
    });
  }, [data, hiddenPairs]);

  const parsePoolsVolume = useMemo(() => {
    const formatedSearch = search.toLowerCase();

    const filteredData = pairsWithHiddenRemoved.filter(
      (item) =>
        item.token0.symbol.toLowerCase().includes(formatedSearch) ||
        item.token1.symbol.toLowerCase().includes(formatedSearch)
    );

    return filteredData.map((item) => ({
      token0: item.token0.id,
      token1: item.token1.id,
      volume: item.dailyVolumeUSD,
      symbol0: item.token0.symbol,
      symbol1: item.token1.symbol,
      pairAddress: item.id,
    }));
  }, [search, pairsWithHiddenRemoved]);

  const renderList = useMemo(() => {
    if (page === 1) {
      return parsePoolsVolume.slice(0, LIMIT);
    } else {
      return parsePoolsVolume.slice(page * LIMIT - LIMIT, page * LIMIT);
    }
  }, [parsePoolsVolume, page]);

  const totalPages = Math.ceil(parsePoolsVolume.length / LIMIT);

  const pageUp = () => {
    if (page + 1 <= totalPages) {
      setPage(page + 1);
    }
  };
  const pageDown = () => {
    if (page - 1 >= 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (search) {
      setPage(1);
    }
  }, [search]);

  return (
    <>
      <PoolTable>
        {/* <TEXT.default fontWeight={600} fontSize="20px" color="textPrimary">
          Pools
        </TEXT.default> */}
        <>
          <h4>
            <span>Pool</span>
            <span>Volume 24H</span>
          </h4>
          <div className="listUl">
            {renderList &&
              renderList.length !== 0 &&
              renderList.map((row, index) => <PoolsListRow key={index.toString()} data={row} />)}
          </div>
          {(!renderList || renderList?.length === 0) && !loading && (
            <TYPE.main color="text3" textAlign="center" mb="20px" mt="20px">
              No results found.
            </TYPE.main>
          )}
          {loading && (
            <TYPE.main color="text3" textAlign="center" mb="20px" mt="20px">
              Loading...
            </TYPE.main>
          )}
        </>
      </PoolTable>

      {renderList && renderList.length !== 0 && (
        <PageNav>
          <a>
            <img style={{ verticalAlign: 'top' }} onClick={pageDown} src={arrowLeft} alt="down" />
          </a>
          <span>
            {' '}
            Page {page} of {totalPages}
          </span>
          <a>
            <img style={{ verticalAlign: 'top' }} onClick={pageUp} src={arrowRight} alt="down" />
          </a>
        </PageNav>
      )}
    </>
  );
}

const PageNav = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: -10px;
  span {
    margin: 0 20px;
    font-weight: 500;
  }
  a {
    display: inline-block;
    height: 10px;
  }
  img {
    height: 10px;
  }
  ${Media.sm} {
    margin-bottom: 0;
  }
`;

const PoolTable = styled.div`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
  h4 {
    display: flex;
    justify-content: space-between;
    color: #80888a;
    padding: 11px 15px;
    margin: 0;
    span {
      font-weight: normal;
      font-size: 16px;
    }
  }
  .listUl {
    display: flex;
    flex-flow: column;
    width: 100%;
  }
`;
