import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import { AutoColumn } from '../Column';
import { StyledHomePageLink } from './styled';
import Gs from '../../theme/globalStyles';
import Media from '../../theme/media-breackpoint';

// OLD SCOMPONENTS
const Wrapper = styled.div`
  width: 100%;
  margin-top: 294px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
`;

const InfoSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  width: 205px;
  margin-left: 15px;
  margin-top: 15px;
  padding: 24px 32px 32px;
  background-color: ${({ theme }) => theme.newTheme.bg8};
`;

const TextSection = styled(AutoColumn)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const renderInfo: { title: string; percentage: string }[] = [
  { title: 'CFNC-USDT', percentage: '4.552.383%' },
  { title: 'CFNC-ETH', percentage: '2.956.383%' },
  { title: 'CFNC-BTC', percentage: '0.022.383%' },
  { title: 'DAI-USDT', percentage: '4.552.383%' },
  { title: 'DIVI-USDT', percentage: '4.552.383%' },
];

const cryptoData: { token: string; apr: string }[] = [
  { token: 'CNFC - USDT', apr: '4.552.383' },
  { token: 'CFNC-ETH', apr: '2.956.383' },
  { token: 'CFNC-BTC', apr: '0.022.383' },
  { token: 'DAI-USDT', apr: '4.552.383' },
  { token: 'DIVI-USDT', apr: '4.552.383 ' },
];

export default function Explore() {
  return (
    <EarnIncome>
      <Gs.Container>
        <h3>
          Earn passive income <br />
          with crypto
        </h3>
        <p>Chief Finance make it easy to make your crypto work for you.</p>
        <div className="card-main">
          {cryptoData.map(({ token, apr }) => (
            <figure key={token}>
              <span>{token}</span>
              <strong>{apr}%</strong>
              <p>APR</p>
            </figure>
          ))}
        </div>
        <StyledHomePageLink to={'/pool'}>Explore </StyledHomePageLink>
      </Gs.Container>
    </EarnIncome>
  );
}

// NEW SCOMPONENTS
const EarnIncome = styled.div`
  padding: 107px 0;
  position: relative;
  z-index: 2;
  &:before {
    content: '';
    background: #158c72;
    position: absolute;
    top: 20%;
    left: -100px;
    height: 300px;
    width: 150px;
    border-radius: 100%;
    z-index: -1;
    filter: blur(50px);
    opacity: 0.2;
  }
  &:after {
    content: '';
    background: #158c72;
    position: absolute;
    top: 20%;
    right: -100px;
    height: 300px;
    width: 150px;
    border-radius: 100%;
    z-index: -1;
    filter: blur(50px);
    opacity: 0.2;
  }
  h3 {
    width: 100%;
    margin: 0 0 25px;
    line-height: 1;
    text-align: center;
    font-size: 60px;
    font-weight: 700;
  }
  p {
    width: 410px;
    text-align: center;
    color: var(--txtLight);
    font-size: 24px;
    margin: 0 auto 60px;
  }
  .card-main {
    width: 100%;
    margin-bottom: 50px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 48px;
    figure {
      box-shadow: 0 0 8px #08514030;
      border-radius: 10px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      text-align: center;
      padding: 24px 0;
      position: relative;
      span {
        font-size: 24px;
        color: var(--txtColor);
        margin: 0 0 4px 0;
      }
      strong {
        color: var(--primary);
        font-size: 35px;
        font-weight: 700;
        margin: 0 0 7px 0;
      }
      p {
        margin: 0;
        color: var(--txtLight);
        font-size: 20px;
        width: 100%;
      }
      &:before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        width: 50px;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-top: 5px solid #cff2ea;
        margin-left: -25px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 50px;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 5px solid #cff2ea;
        margin-left: -25px;
      }
    }
  }
  ${Media.lg} {
    .card-main {
      gap: 30px;
    }
  }
  ${Media.lg2} {
    .card-main {
      gap: 15px;
      figure {
        padding: 20px 0;
        span {
          font-size: 20px;
          margin: 0;
        }
        strong {
          font-size: 26px;
          margin: 5px 0;
        }
        p {
          font-size: 20px;
        }
      }
    }
  }
  ${Media.md} {
    h3 {
      font-size: 45px;
      margin: 0 0 20px;
    }
    p {
      font-size: 20px;
    }
    .card-main {
      display: flex;
      justify-content: center;
      flex-flow: wrap;
      gap: 20px;
      figure {
        width: 30%;
      }
    }
  }
  ${Media.xs} {
    padding: 80px 0;
    h3 {
      font-size: 35px;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
    }
    .card-main {
      display: flex;
      justify-content: center;
      flex-flow: wrap;
      gap: 20px;
      figure {
        width: 200px;
        max-width: calc(50% - 20px);
        strong {
          font-size: 24px;
        }
      }
    }
  }
`;
