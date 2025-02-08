import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import axios from 'axios';
import Eth from '../../assets/images/eth.png';
import Media from '../../theme/media-breackpoint';
import OwlCarousel from 'react-owl-carousel-rtl';
import 'owl.carousel/dist/assets/owl.carousel.css';
import CurrencyLogo from 'components/CurrencyLogo';
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@bidelity/sdk';
import { ethers } from 'ethers';
interface TokenProps {
  name: string;
  price: number;
  change: number;
  img: any;
}

interface TokenPrices {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}
interface CurrencyData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}
// interface CurrenciesImg {
//   data: CurrencyData[];
// }

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TokenItemWrapper = styled.div`
  padding: 0 10px;
  display: flex;
`;

const PriceItem = styled.div`
  margin-left: 5px;
`;

const tokens =
  'ethereum,wrapped-bitcoin,usd-coin,shiba-inu,tether,coinbase-wrapped-staked-eth,matic-network,uniswap,dai,binance-usd,hex,yearn-finance,quant-network,gnosis,maker';

const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd&include_24hr_change=true`;

const TOKEN_NAMES = {
  ethereum: 'ETH',
  'wrapped-bitcoin': 'WBTC',
  'usd-coin': 'USDC',
  'shiba-inu': 'SHIB',
  tether: 'USDT',
  'coinbase-wrapped-staked-eth': 'WETH',
  'matic-network': 'MATIC',
  uniswap: 'UNI',
  dai: 'DAI',
  'binance-usd': 'BUSD',
  hex: 'HEX',
  'yearn-finance': 'YFI',
  'quant-network': 'QNT',
  gnosis: 'GNO',
  maker: 'MKR',
};

type TockensIds =
  | 'ethereum'
  | 'wrapped-bitcoin'
  | 'usd-coin'
  | 'shiba-inu'
  | 'tether'
  | 'coinbase-wrapped-staked-eth'
  | 'matic-network'
  | 'uniswap'
  | 'dai'
  | 'binance-usd'
  | 'hex'
  | 'yearn-finance'
  | 'quant-network'
  | 'gnosis'
  | 'maker';

export default function PricesRow({
  tokensPrices,
  currencyImg,
}: {
  tokensPrices: TokenPrices;
  currencyImg: CurrencyData[] | null;
}) {
  let keys: TockensIds[] = [];
  if (tokensPrices) {
    keys = Object.keys(tokensPrices) as TockensIds[];
  }
  return (
    <>
      {tokensPrices !== null &&
        keys.length !== 0 &&
        keys.map((key, index) => {
          const currencyImage = currencyImg?.find((image) => image.id === key);
          // console.log({currencyImage})
          return (
            <Fragment key={key}>
              <TokenItem
                name={TOKEN_NAMES[key]}
                price={tokensPrices[key].usd}
                change={tokensPrices[key].usd_24h_change}
                img={currencyImage?.image}
              />
            </Fragment>
          );
        })}
    </>
  );
}

const TokenItem = ({ name, price, change, img }: TokenProps) => {
  const isRed = change.toString().includes('-');

  return (
    <div className="tag">
      <img src={img} alt="eth" onError={(e) => (e.currentTarget.src = '../../assets/images/eth.png')} />
      {/* <CurrencyLogo currency={Currency} size={'33px'} /> */}

      {name}
      <TEXT.default
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 16,
          marginLeft: '8px',
        }}
        fontWeight={600}
        fontSize={12}
        color={isRed ? 'error' : 'primary1'}
      >
        ${price}
      </TEXT.default>
    </div>
  );
};
