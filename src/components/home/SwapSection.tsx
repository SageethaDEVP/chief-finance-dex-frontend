import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CurrencyAmount, Token, TokenAmount, JSBI } from '@bidelity/sdk';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import {
  useDefaultHomePageState,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import axios from 'axios';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { Field } from '../../state/swap/actions';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import CurrencyInputPanel from '../CurrencyInputPanel';
import ArrowsCellIcon from '../../assets/svg-bid/button-cell.svg';
import ArrowWhite from '../../assets/svg-bid/vector-white.svg';
import { ButtonPrimary } from '../Button';
import { useTranslation } from 'react-i18next';
import { useWalletModalToggle } from '../../state/application/hooks';
import { useActiveWeb3React } from '../../hooks';
import { useHistory } from 'react-router';
import { useCurrency } from '../../hooks/Tokens';
import { usePair } from '../../data/Reserves';
import { FIVE_PERCENTS, nativeSymbol, wrappedSymbol } from '../../constants';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';
import bannerEl from '../../assets/images/bannerEl.png';
import bannerBg from '../../assets/images/bannerBg.jpg';
import Thr from '../../assets/images/tather.png';
import Dwn from '../../assets/images/down.png';
import Eth from '../../assets/images/eth.png';
import Swap from '../../assets/images/swap.png';
import WalletIco from '../../assets/images/wallet.png';
import OwlCarousel from 'react-owl-carousel-rtl';
import 'owl.carousel/dist/assets/owl.carousel.css';
import TokenList from '../home/PricesRow';

// OLD SCOMPONENTS

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
const Wrapper = styled.div`
  width: 100%;
  margin-top: 132px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextWrapper = styled.div`
  max-width: 840px;
`;

const ButtonWrapper = styled.div`
  margin-left: 15px;
`;

const Button = styled(ButtonPrimary)`
  border-radius: 7px;
  padding: 24px 50px;
  font-size: 14px;
  max-height: 66px;
`;

const RightSection = styled.div`
  margin-top: 80px;
  width: fit-content;
  max-width: 1000px;
  display: flex;
  align-items: center;
`;

const Spacing = styled.div<{ marginTop?: string; marginLeft?: string }>`
  margin-top: ${({ marginTop }) => !!marginTop && marginTop};
  margin-left: ${({ marginLeft }) => !!marginLeft && marginLeft};
`;

const ArrowWrapper = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border: 1px solid ${({ theme }) => theme.newTheme.primary1};
  border-radius: 5px;
  transform: rotate(90deg);
  cursor: pointer;
`;

const Icon = styled.div`
  display: flex;
  margin-left: 11px;
`;

const TopRow = styled.div`
  padding: 16px 65px 9px;
`;
export default function SwapSection() {
  const logoSlider = {
    0: {
      margin: 16,
    },
    768: {
      margin: 16,
    },
    991: {
      margin: 16,
    },
    1400: {
      margin: 16,
    },
  };
  const { account } = useActiveWeb3React();

  useDefaultHomePageState();

  const history = useHistory();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  const [isFivePercent, setIsFivePercent] = useState(false);

  // swap state
  const { independentField, typedValue } = useSwapState();
  const { v2Trade, v2UniTrade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo();
  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const { chainId } = useActiveWeb3React();

  const inputCurrencyName = currencies[Field.INPUT] && currencies[Field.INPUT]?.symbol;
  const outputCurrencyName = currencies[Field.OUTPUT] && currencies[Field.OUTPUT]?.symbol;

  const inputValueA =
    inputCurrencyName === nativeSymbol[chainId ? chainId : 1]
      ? currencies[Field.INPUT]?.symbol
      : (currencies[Field.INPUT] as Token)?.address;

  const inputValueB =
    outputCurrencyName === nativeSymbol[chainId ? chainId : 1]
      ? currencies[Field.OUTPUT]?.symbol
      : (currencies[Field.OUTPUT] as Token)?.address;
  const currencyA = useCurrency(inputValueA);
  const currencyB = useCurrency(inputValueB);

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

  // const trade = v2Trade && !isFivePercent ? v2Trade : v2UniTrade;
  const trade = v2Trade;

  const parsedAmounts = useMemo(() => {
    return showWrap
      ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
      : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        };
  }, [independentField, parsedAmount, showWrap, trade?.inputAmount, trade?.outputAmount]);

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const formattedAmounts = useMemo(() => {
    return {
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    };
  }, [dependentField, independentField, parsedAmounts, showWrap, typedValue]);

  const v2Pair = usePair(currencyA ? currencyA : undefined, currencyB ? currencyB : undefined);
  const getCurrencyPoolAmount = useCallback(
    (currencySymbol: string | undefined) => {
      if (v2Pair && v2Pair[1] && v2Pair[1]?.token0 && v2Pair[1]?.token1) {
        const token0 = v2Pair[1]?.token0;
        const token1 = v2Pair[1]?.token1;
        let amount;
        if (currencySymbol === token0.symbol) {
          amount = new TokenAmount(v2Pair[1]?.token0, v2Pair[1]?.reserve0.raw);
        } else if (currencySymbol === token1.symbol) {
          amount = new TokenAmount(v2Pair[1]?.token1, v2Pair[1]?.reserve1.raw);
        } else if (
          currencySymbol === nativeSymbol[chainId ? chainId : 1] &&
          token0.symbol === wrappedSymbol[chainId ? chainId : 1]
        ) {
          amount = new TokenAmount(v2Pair[1]?.token0, v2Pair[1]?.reserve0.raw);
        } else if (
          currencySymbol === nativeSymbol[chainId ? chainId : 1] &&
          token1.symbol === wrappedSymbol[chainId ? chainId : 1]
        ) {
          amount = new TokenAmount(v2Pair[1]?.token1, v2Pair[1]?.reserve1.raw);
        }
        return amount?.toSignificant(6);
      } else {
        return undefined;
      }
    },
    [v2Pair]
  );

  const currencyAPoolAmount = useMemo(() => {
    return getCurrencyPoolAmount(currencyA?.symbol);
  }, [getCurrencyPoolAmount, currencyA?.symbol]);

  const percents = useMemo(() => {
    return formattedAmounts[Field.INPUT] && currencyAPoolAmount
      ? (+formattedAmounts[Field.INPUT] / +currencyAPoolAmount) * 100
      : undefined;
  }, [currencyAPoolAmount, formattedAmounts]);

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  useEffect(() => {
    if (percents === undefined && userHasSpecifiedInputOutput) {
      localStorage.setItem('isGreater', 'true');
      setIsFivePercent(true);
    } else if (percents && percents >= FIVE_PERCENTS) {
      localStorage.setItem('isGreater', 'true');
      setIsFivePercent(true);
    } else if (percents && percents < FIVE_PERCENTS) {
      localStorage.setItem('isGreater', 'false');
      setIsFivePercent(false);
    }

    return () => localStorage.removeItem('isGreater');
  }, [percents, userHasSpecifiedInputOutput]);

  const [approval] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const maxAmountOutput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.OUTPUT]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleMaxOutput = useCallback(() => {
    maxAmountOutput && onUserInput(Field.OUTPUT, maxAmountOutput.toExact());
  }, [maxAmountOutput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const { t } = useTranslation();

  const toggleWalletModal = useWalletModalToggle();

  const navigateToSwap = () => {
    const address1 =
      currencies[Field.INPUT]?.symbol === nativeSymbol[chainId ? chainId : 1]
        ? currencies[Field.INPUT]?.symbol
        : (currencies[Field.INPUT] as Token)?.address;

    const address2 =
      currencies[Field.OUTPUT]?.symbol === nativeSymbol[chainId ? chainId : 1]
        ? currencies[Field.OUTPUT]?.symbol
        : (currencies[Field.OUTPUT] as Token)?.address;

    if (Boolean(formattedAmounts[Field.INPUT])) {
      localStorage.setItem('inputAmount', String(formattedAmounts[Field.INPUT]));
    }
    if (Boolean(formattedAmounts[Field.OUTPUT])) {
      localStorage.setItem('outputAmount', String(formattedAmounts[Field.OUTPUT]));
    }

    history.push(`/swap?inputCurrency=${address1}&outputCurrency=${address2}`);
  };

  const tokens =
    'ethereum,wrapped-bitcoin,usd-coin,shiba-inu,tether,coinbase-wrapped-staked-eth,matic-network,uniswap,dai,binance-usd,hex,yearn-finance,quant-network,gnosis,maker';

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd&include_24hr_change=true`;
  // const imgUrl = `https://data-api.cryptocompare.com/asset/v1/data/by/symbol?asset_symbol==${coinIds}`;
  // const imgUrl = `https://api.coingecko.com/api/v3/coins/id=${coinIds}`;
  const coinIds = [
    'ethereum',
    'wrapped-bitcoin',
    'usd-coin',
    'shiba-inu',
    'tether',
    'coinbase-wrapped-staked-eth',
    'matic-network',
    'uniswap',
    'dai',
    'binance-usd',
    'hex',
    'yearn-finance',
    'quant-network',
    'gnosis',
    'maker',
  ];
  const joinedIds = coinIds.join(',');

  const imgUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${joinedIds}`;
  const [tokensPrices, setTokenPrices] = useState<TokenPrices | null>(null);

  const [currencyImg, setCurrencyImg] = useState<CurrencyData[] | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem('currencyData');
      if (storedData) {
        const { data, timestamp } = JSON.parse(storedData);
        const currentTime = new Date().getTime();
        const dataAge = currentTime - timestamp;
        const maxAge = 60 * 60 * 1000; // 1 hour
        if (dataAge < maxAge) {
          setCurrencyImg(data);
          return;
        }
      }

      const response = await axios.get<CurrencyData[]>(imgUrl);
      const newData = response.data;
      localStorage.setItem('currencyData', JSON.stringify({ data: newData, timestamp: new Date().getTime() }));
      setCurrencyImg(newData);
    } catch (error) {
      console.error('Error fetching currency data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<TokenPrices>(url);
      setTokenPrices(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchImages();
  }, []);

  return (
    <>
      <Banner>
        <Gs.Container>
          <div className="banner-left">
            <h1>
              <span>Token</span> swap with efficiency
            </h1>
            <p>
              At our cryptocurrency token exchange platform, we offer an easy-to-use token swap service that allows you
              to seamlessly exchange one type of token for another with maximum efficiency.
            </p>
          </div>
          <Exchange>
            <div className="ExTop">
              <CurrencyInputPanel
                label={'From'}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={false}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                showAvailableInPool={false}
                isHomePage={true}
                label2="You Send"
                isFirst={true}
              />

              <a
                className="switch"
                onClick={() => {
                  setApprovalSubmitted(false); // reset 2 step UI for approvals
                  onSwitchTokens();
                }}
              >
                <img src={Swap} alt="Swap" />
              </a>

              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={'To'}
                showMaxButton={false}
                onMax={handleMaxOutput}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
                showAvailableInPool={false}
                isHomePage={true}
                isSecond={true}
                label2="You Get"
              />
            </div>

            {account === null && (
              <Gs.BtnSm className="lg" onClick={toggleWalletModal}>
                <img src={WalletIco} alt="Wallet" /> Connect Wallet
              </Gs.BtnSm>
            )}
            {account !== null && (
              <Gs.BtnSm className="lg" onClick={navigateToSwap}>
                <TEXT.default>Exchange</TEXT.default>
                <Icon>
                  <img src={ArrowWhite} alt="icon" />
                </Icon>
              </Gs.BtnSm>
            )}
          </Exchange>
        </Gs.Container>
      </Banner>

      {tokensPrices !== null && (
        <SliderContainer>
          <MovingLogos>
            <OwlCarousel
              className="owl-theme"
              smartSpeed={5500}
              autoplayTimeout={5000}
              loop
              margin={16}
              autoWidth={true}
              autoplay={true}
              responsive={logoSlider}
            >
              <TokenList currencyImg={currencyImg} tokensPrices={tokensPrices} />
            </OwlCarousel>
          </MovingLogos>
          <MovingLogos className="cambioR">
            <OwlCarousel
              className="owl-theme"
              smartSpeed={5500}
              autoplayTimeout={5000}
              rtlClass="owl-rtl"
              rtl={true}
              loop
              margin={16}
              autoWidth={true}
              autoplay={true}
              responsive={logoSlider}
            >
              <TokenList currencyImg={currencyImg} tokensPrices={tokensPrices} />
            </OwlCarousel>
          </MovingLogos>
        </SliderContainer>
      )}
    </>
  );
}
// NEW SCOMPONENTS
const Banner = styled.div`
  width: 100%;
  padding: 156px 0 173px 0;
  position: relative;
  z-index: 2;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1032px;
    background: url(${bannerBg}) no-repeat;
    z-index: -1;
  }
  h1 {
    font-size: 100px;
    margin: 0 0 31px 0;
    line-height: 1;
    letter-spacing: -1.5px;
    span {
      color: var(--primary);
      border: 1px dashed currentColor;
      display: inline-block;
      padding: 0 15px;
      line-height: 1;
      margin-left: -15px;
      margin-right: -10px;
    }
  }
  p {
    color: var(--txtLight);
    font-size: 24px;
    padding-right: 50px;
  }
  .banner-left {
    width: 685px;
    align-self: center;
  }
  ${Media.lg} {
    &:after {
      background-size: cover;
    }
    .banner-left {
      width: 48%;
    }
    h1 {
      font-size: 80px;
    }
    p {
      padding-right: 0;
    }
  }
  ${Media.lg2} {
    padding: 100px 0 130px 0;
    h1 {
      font-size: 66px;
    }
    p {
      font-size: 20px;
      line-height: 1.4;
    }
  }
  ${Media.md} {
    .banner-left {
      width: 100%;
      margin-bottom: 30px;
      text-align: center;
    }
    h1 {
      span {
        margin: 0;
      }
    }
  }
  ${Media.sm} {
    h1 {
      font-size: 56px;
    }
  }
  ${Media.xs} {
    padding: 70px 0 80px 0;
    h1 {
      font-size: 40px;
      margin: 0 0 22px 0;
      span {
        padding: 2px 8px;
      }
    }
  }
`;
const Exchange = styled.div`
  width: 602px;
  box-shadow: 0 0 8px #08514030;
  display: flex;
  border-radius: 30px;
  margin-left: auto;
  padding: 50px;
  flex-flow: column;
  align-self: center;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  &:after {
    content: '';
    position: absolute;
    right: 100%;
    top: 32px;
    background: url(${bannerEl}) no-repeat;
    width: 225px;
    height: 221px;
  }
  .ExTop {
    position: relative;
    margin: 0 0 26px 0;
    .switch {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -8px;
      background: var(--primary);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 5px rgba(27, 193, 154, 0.2);
      transition: all 0.3s ease-in-out 0s;
      cursor: pointer;
      z-index: 1;
      &:hover {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  .ExBox {
    display: flex;
    box-shadow: 1px -2px 7px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    height: 128px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.6);
    &:focus-within {
      box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.16);
    }
    .input-container {
      position: relative;
      input {
        border: 0px;
        font-size: 35px;
        background: none;
        color: #9ba4a6;
        font-family: var(--font);
        padding: 12px 30px 0;
        height: 128px;
        width: 100%;
      }
      label {
        font-size: 20px;
        color: var(--txtColor);
        position: absolute;
        padding: 0 30px;
        top: 25px;
        left: 0;
      }
    }
    .ExBox-right {
      width: 160px;
      flex-shrink: 0;
      align-self: center;
      padding: 0 20px 0 0;
      .selectBtn {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 2px;
        width: 100%;
        border-radius: 4px;
        padding: 4px 8px;
        &:hover {
          background: rgba(0, 0, 0, 0.16);
        }
        .token {
          margin-right: 9px;
          width: 28px;
          height: 28px;
        }
        .arrow {
          margin-left: auto;
          margin-right: 5px;
          flex-shrink: 0;
          position: relative;
          right: -5px;
        }
      }
      h4 {
        font-size: 24px;
        color: var(--txtColor);
        font-weight: 500;
        margin: 0;
        padding: 0 8px 4px;
      }
    }
  }
  ${Media.lg} {
    max-width: 48%;
    &:after {
      width: 160px;
      height: 210px;
      background-size: contain;
    }
  }
  ${Media.lg2} {
    padding: 35px;
    &:after {
      display: none;
    }
    .ExTop {
      margin-bottom: 5px;
    }
  }
  ${Media.md} {
    width: 100%;
    max-width: 100%;
  }
  ${Media.xs} {
    padding: 25px;
    .ExBox {
      flex-flow: column;
      height: auto;
      .input-container {
        border-bottom: 1px solid #e5e5e5;
        padding-top: 15px;
        input {
          height: 50px;
          font-size: 25px;
          padding: 0 30px 0;
        }
        label {
          font-size: 18px;
          top: 5px;
          position: static;
        }
      }
      .ExBox-right {
        width: 100%;
        padding: 15px 10px;
        h4 {
          font-size: 20px;
        }
      }
    }
  }
`;
// const SliderContainer = styled.div`
//   position: relative;
//   z-index: 4;
//   &:before {
//     content: '';
//     background: #fff;
//     position: absolute;
//     top: -40px;
//     bottom: -40px;
//     right: -80px;
//     width: 240px;
//     z-index: 4;
//     filter: blur(25px);
//   }
//   &:after {
//     content: '';
//     background: #fff;
//     position: absolute;
//     top: -40px;
//     bottom: -40px;
//     left: -80px;
//     width: 240px;
//     z-index: 4;
//     filter: blur(25px);
//   }
//   ${Media.sm} {
//     &:before {
//       right: -180px;
//     }
//     &:after {
//       left: -180px;
//     }
//   }
// `;

const SliderContainer = styled.div`
  position: relative;
  z-index: 2;
  // z-index: 4;
  &:before {
    content: '';
    background: #fff;
    position: absolute;
    top: -40px;
    bottom: -40px;
    right: -80px;
    width: 240px;
    z-index: 4;
    filter: blur(25px);
  }
  &:after {
    content: '';
    background: #fff;
    position: absolute;
    top: -40px;
    bottom: -40px;
    left: -80px;
    width: 240px;
    z-index: 4;
    filter: blur(25px);
  }
  ${Media.sm} {
    &:before {
      right: -180px;
    }
    &:after {
      left: -180px;
    }
  }
`;
const MovingLogos = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  position: relative;
  z-index: 2;
  .tag {
    height: 60px;
    width: 177px;
    background: #fff;
    box-shadow: 0 0 8px #08514030;
    border-radius: 50px;
    margin: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    text-transform: uppercase;
    span {
      // color: var(--txtRed);
      margin-left: 8px;
    }
  }
  .owl-carousel .owl-item img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    margin-right: 8px;
  }
  .owl-carousel.owl-rtl {
    .tag {
      direction: ltr;
    }
  }
  .owl-dots {
    display: none;
  }
  /* @keyframes cambio {
    from {margin-left: 0%}
    to {margin-left: -100%}
  }
  @keyframes cambioR {
    from {margin-left: 0%}
    to {margin-left: 100%}
  } */
  ${Media.xs} {
    .tag {
      height: 50px;
      width: 165px;
    }
  }
`;
