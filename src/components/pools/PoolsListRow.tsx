import React from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrency } from '../../hooks/Tokens';
import { PoolCurrency } from '../../hooks/pools';
import { TEXT } from '../../theme';
import CurrencyLogo from '../CurrencyLogo';
import Question from '../../assets/images/question.png';

interface Props {
  data: PoolCurrency;
}

const Align = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.newTheme.border3};
  cursor: pointer;
`;

const DoubleLogos = styled.div`
  position: relative;
  margin-right: 6px;
  margin-top: 3px;
`;

const SmallLogo = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const ONE_MILLION = 1000000;

export default function PoolsListRow({ data }: Props) {
  // const {
  //   loading,
  //   error,
  //   data: daiData,
  // } = useQuery<DaiData>(PAIR_VOLUME_QUERY, {
  //   variables: {
  //     pairAddress: data.pairAddress,
  //   },
  // });
  const { token0, token1 } = data;
  // const [volume, setVolume] = useState<string>('-');
  const currencyA = useCurrency(token0);
  const currencyB = useCurrency(token1);

  const location = useLocation();
  const history = useHistory();

  function getVolume() {
    if (!data.volume) {
      return '-';
    }
    const rawValue = data.volume;
    if (rawValue) {
      const value = parseInt(rawValue);
      if (value > ONE_MILLION) {
        const number = (value / ONE_MILLION).toFixed(2);
        return `$${number}m`;
      }
    }
    return '-';
  }

  const navigateToLiquidity = () => {
    history.push(`/add/${token0}/${token1}`);
  };
  const navigateToSwap = () => {
    history.push(`/swap?inputCurrency=${token0}&outputCurrency=${token1}`);
  };

  const toSwap = location.pathname.match(/pools$/);

  // if (!currencyA || !currencyB) return null;

  return (
    <>
      <ListRow onClick={toSwap ? navigateToSwap : navigateToLiquidity}>
        <div>
          <Align>
            <span>
              <DoubleLogos>
                <CurrencyLogo currency={currencyA ? currencyA : undefined} address={token0} size={'24px'} />
                <SmallLogo>
                  <CurrencyLogo currency={currencyB ? currencyB : undefined} address={token1} size={'14px'} />
                </SmallLogo>
              </DoubleLogos>
              {currencyA?.symbol || data.symbol0}-{currencyB?.symbol || data.symbol1}
            </span>
          </Align>
        </div>
        <span>{getVolume()}</span>
      </ListRow>
    </>
  );
}


const ListRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 15px 15px;
  background: #fff;
  span {
    color: var(--txtLight);
    line-height: 1.5;
    font-size: 18px;
    display: flex;
    align-items: center;
    font-weight: 500;
    img {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  &:nth-child(odd) {
    background: #e8f9f5;
  }
`;
