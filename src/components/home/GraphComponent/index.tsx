import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { TEXT } from '../../../theme';
import ArrowRightGrey from '../../../assets/svg-bid/arrow-right-grey.svg';
import CurrencyLogo from '../../CurrencyLogo';
import axios from 'axios';
import { createChart, LineData, Time } from 'lightweight-charts';
import { useCurrency } from '../../../hooks/Tokens';
import { useHistory } from 'react-router';
import { chartOptions, setAreaOptions } from './chart-config';
import { useFindTokenAddress } from '../../../state/swap/hooks';
import ChartSm from '../../../assets/images/chartSm.png';
import Thr from '../../../assets/images/tather.png';
import Eth from '../../../assets/images/eth.png';
import Media from '../../../theme/media-breackpoint';
import { nativeSymbol } from '../../../constants';
import { useActiveWeb3React } from 'hooks';

// OLD SCOMPONENTS
const Wrapper = styled.tr<{ growth: boolean }>``;

const RowItem = styled.div`
  display: flex;
`;

const Spacing = styled.div<{ ml: number }>`
  margin-left: ${({ ml }) => ml && ml + 'px'};
`;

const GraphContainer = styled.div`
  width: 100%;
  height: 80px;
  margin-top: 15px;
`;

interface DataType {
  time: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
  close: number;
  conversionType: string;
  conversionSymbol: string;
}

interface Data {
  TimeFrom: number;
  TimeTo: number;
  Aggregated: boolean;
  Data: DataType[];
}

interface Response2 {
  Response: string;
  Message: string;
  HasWarning: boolean;
  Type: number;
  Data: Data;
}

interface Props {
  currency1: string;
  currency2: string;
}

const width = 240;
const height = 80;

export function GraphComponent({ currency1, currency2 }: Props) {
  const container = useRef<HTMLDivElement | null>(null);
  const canFetch = useRef<boolean>(true);
  const chartWasCreated = useRef<boolean>(false);
  const { chainId } = useActiveWeb3React();

  const [dailyData, setDailyData] = useState<LineData[]>([]);
  const [currencyPrice, setCurrencyPrice] = useState<number>(0);
  const [hasGrown, setHasGrown] = useState<boolean>(false);

  const address1 = useFindTokenAddress(currency1);
  const address2 = useFindTokenAddress(currency2);

  const addressOrEth1 = currency1 !== nativeSymbol[chainId || 1] ? address1 : nativeSymbol[chainId || 1];
  const addressOrEth2 = currency2 !== nativeSymbol[chainId || 1] ? address2 : nativeSymbol[chainId || 1];

  const currencyA = useCurrency(addressOrEth1);
  const currencyB = useCurrency(addressOrEth2);

  const history = useHistory();

  const fetchDailyData = async () => {
    if (!canFetch.current) {
      return;
    }
    try {
      const { data } = await axios.get<Response2>(
        `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${currency1.toUpperCase()}&tsym=${currency2.toUpperCase()}&limit=20`
      );
      const result: LineData[] = data.Data.Data.map((item) => ({ time: item.time as Time, value: item.open }));
      setDailyData(result);
      canFetch.current = false;
      if (result.length) {
        const isGrowth = result[0].value < result[result.length - 1].value;
        setHasGrown(isGrowth);
      }
    } catch (err) {
      console.debug('Fetch daily data', err);
    }
  };

  const fetchPrice = async () => {
    try {
      const { data } = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${currency1.toUpperCase()}&tsyms=${currency2.toUpperCase()}`
      );
      setCurrencyPrice(data[currency2]);
    } catch (err) {
      console.debug('Fetch token price for graph', err);
    }
  };

  const navigateToSwap = () => {
    history.push(`/swap?inputCurrency=${addressOrEth1}&outputCurrency=${addressOrEth2}`);
  };

  useEffect(() => {
    fetchDailyData();
    fetchPrice();
  }, [chainId]);

  if (!dailyData || dailyData.length === 0) {
    return null;
  }

  if (container.current && !chartWasCreated.current) {
    const chart = createChart(container.current, chartOptions);
    chart.resize(width, height);
    const lineSeries = chart.addAreaSeries(setAreaOptions(hasGrown));
    lineSeries.setData(dailyData);
    chart.timeScale().fitContent();
    chartWasCreated.current = true;
  }

  const growth = ((dailyData[dailyData.length - 1].value - dailyData[0].value) / dailyData[0].value) * 100;

  return (
    <>
      <Wrapper onClick={navigateToSwap} growth={hasGrown}>
        <td data-title="Exchange">
          <b className="coins">
            <CurrencyLogo style={{ width: '25px', height: '25px' }} currency={currencyA ? currencyA : undefined} />
            <CurrencyLogo style={{ width: '25px', height: '25px' }} currency={currencyB ? currencyB : undefined} />
          </b>
          {currency1} - {currency2}
        </td>
        <td data-title="24-Hours Statics" color={hasGrown ? 'primary1' : '#E63449'}>
          <TEXT.default fontWeight={400} fontSize={20} color={hasGrown ? 'primary1' : '#E63449'}>
            {growth.toFixed(2)}%
          </TEXT.default>
        </td>
        <td data-title="Market State">
          <div className="chart">
            <GraphContainer ref={container}></GraphContainer>
          </div>
        </td>
        <td data-title="Volume">
          1 {currency1} = <br />
          {currencyPrice} {currency2}
        </td>
      </Wrapper>
    </>
  );
}
