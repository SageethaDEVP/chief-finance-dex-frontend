import { JSBI, Pair, Percent, TokenAmount } from '@bidelity/sdk';
import { darken } from 'polished';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTotalSupply } from '../../data/TotalSupply';
import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { TEXT } from '../../theme';
import { currencyId } from '../../utils/currencyId';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { ButtonPrimary } from '../Button';
import Card, { LightCard } from '../Card';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { RowBetween } from '../Row';
import OpenIcon from '../../assets/svg-bid/vector-down.svg';
import CloseIcon from '../../assets/svg-bid/vector-up.svg';
import { useAddToMetamask } from '../../hooks/useAddToMetamask';
import { ZERO_STRING } from '../../constants';
import Gs from 'theme/globalStyles';

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

export const HoverCard = styled(Card)`
  border: 1px solid transparent;

  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`;

const Wrapper = styled.div`
  padding: 16px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.newTheme.white};
`;

const InnerSection = styled.div`
  padding: 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
`;

const LiquidityCard = styled.div`
  margin-top: 8px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border-radius: 14px;
  overflow: hidden;
`;

const PairInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InlineDiv = styled.div`
  display: flex;
  align-items: center;
`;

const AddLiquidityButton = styled(ButtonPrimary)`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-radius: 10px;
`;

const RemoveLiquidityButton = styled(ButtonPrimary)`
  border: 1px solid #c0c0cf;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  color: ${({ theme }) => theme.newTheme.black};
  padding: 6px 20px;
  margin-right: 16px;
  font-size: 12px;
  font-weight: 600;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.05, theme.newTheme.bg2)};
  }
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    totalPoolTokens?.toSignificant(6) !== ZERO_STRING &&
    !!userPoolBalance &&
    userPoolBalance?.toSignificant(6) !== ZERO_STRING &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <InfoSec className="mt0">
          <h4>LP tokens in your wallet</h4>
          <div className="img">
            <p className="bold">
              <CurrencyLogo size="17px" currency={currency0} />
              <CurrencyLogo size="17px" currency={currency1} />
              {currency0.symbol} - {currency1.symbol}
              <span>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</span>
            </p>
          </div>
          <p>
            Share of Pool:
            <span>{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</span>
          </p>
          <p>
            Pool {currency0.symbol}:<span>{token0Deposited ? token0Deposited?.toSignificant(6) : '-'}</span>
          </p>
          <p>
            Pool {currency1.symbol}:<span>{token1Deposited ? token1Deposited?.toSignificant(6) : '-'}</span>
          </p>
        </InfoSec>
      ) : (
        <LightCard>
          <TEXT.secondary fontWeight={500} fontSize={12} lineHeight="24px">
            By adding liquidity you&apos;ll earn 0.17% of all trades on this pair proportional to your share of the
            pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TEXT.secondary>
        </LightCard>
      )}
    </>
  );
}

export default function FullPositionCard({ pair, stakedBalance }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const lpToken = pair.liquidityToken;
  // console.log('lpTokens :', lpToken);

  const addToMetamask = useAddToMetamask(lpToken);

  const [showMore, setShowMore] = useState(false);
  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <LiquidityList>
      <li>
        <div className="LLTitle">
          <i>
            <CurrencyLogo currency={currency0} size={'17px'} />
            <CurrencyLogo currency={currency1} size={'17px'} />
          </i>
          {!showMore ? (
            <span>
              {currency0.symbol} - {currency1.symbol}
              <p>{userPoolBalance?.toSignificant(6)}</p>
            </span>
          ) : (
            <div>
              {currency0.symbol} - {currency1.symbol}
              <p>{userPoolBalance?.toSignificant(6)}</p>
            </div>
          )}
          <div className="arrowDown" onClick={() => setShowMore(!showMore)}>
            <img src={showMore ? CloseIcon : OpenIcon} alt="icon" />
          </div>
          {showMore && (
            <Gs.BtnSm
              className="sm secondary"
              as={Link}
              to={`/remove/${currencyId(currency0, chainId || 1)}/${currencyId(currency1, chainId || 1)}`}
            >
              Remove Liquidity
            </Gs.BtnSm>
          )}
        </div>

        {showMore && (
          <div className="LLContent">
            <p>
              <i>
                <CurrencyLogo currency={currency0} size={'17px'} />
              </i>
              {currency0.symbol}
              <span>{token0Deposited?.toSignificant(6)}</span>
            </p>
            <p>
              <i>
                <CurrencyLogo currency={currency1} size={'17px'} />
              </i>
              {currency1.symbol}
              <span>{token1Deposited?.toSignificant(6)}</span>
            </p>
            <p>
              Reward
              <span>-</span>
            </p>
            <p>
              Share of Pool
              <span>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </span>
            </p>
            <Gs.BtnSm className="lg" onClick={addToMetamask}>
              Add {lpToken.symbol} token to Metamask
            </Gs.BtnSm>
          </div>
        )}
      </li>
    </LiquidityList>
  );
}

const LiquidityList = styled.ul`
  margin: 0;
  padding: 0;
`;

const InfoSec = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 15px 19px 5px;
  margin: -10px 0 21px 0;
  &.mt0 {
    margin-top: 0;
  }
  p {
    display: flex;
    align-items: center;
    color: var(--txtLight);
    margin: 0 0 11px 0;
    a {
      vertical-align: top;
      display: inline-block;
      margin: 5px 0 0 8px;
    }
    span {
      margin-left: auto;
    }
    &.bold {
      font-weight: 600;
    }
  }
  .img {
    margin-right: 7px;
    img {
      margin-right: 3px;
    }
  }
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--txtLight);
    margin: 0 0 16px;
  }
`;
