import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GraphComponent } from './GraphComponent';
import { useHistory } from 'react-router';
import Media from '../../theme/media-breackpoint';
import Thr from '../../assets/images/tather.png';
import Eth from '../../assets/images/eth.png';
import Timg from '../../assets/images/Timg.png';
import ArrowR from '../../assets/images/arrow-right.png';
import ChartSm from '../../assets/images/chartSm.png';
import { Link } from 'react-router-dom';
import { useActiveWeb3React } from 'hooks';

const StyledArrow = styled(Link)`
  width: 30px;
  height: 30px;
  background: var(--primary);
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px rgba(27, 193, 154, 0.2);
  margin-left: 14px;
  flex-shrink: 0;
`;

export default function PopularPairs() {
  const history = useHistory();

  const { account, chainId } = useActiveWeb3React();

  return (
    <TableContainer>
      <TbTop>
        <h3>Popular exchange pairs</h3>
        <div className="TbTop-right">
          <div className="">
            <img src={Timg} alt="" />
          </div>
          <div className="">
            <h4>Explore multiple other assets</h4>
            <p>New assets are specially selected and added regularly.</p>
          </div>
          <StyledArrow to={'/pool'}>
            <img src={ArrowR} alt="Arrow" />
          </StyledArrow>
        </div>
      </TbTop>
      <table>
        <thead>
          <tr>
            <th align="left">Exchange</th>
            <th align="left">24-Hours Statics</th>
            <th align="center">Market State</th>
            <th align="left">Volume</th>
          </tr>
        </thead>

        {chainId === 11155111 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETH" />
            <GraphComponent currency1="WBTC" currency2="ETH" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETH" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 97 ? (
          <>
            <GraphComponent currency1="USDC" currency2="BNB" />
            <GraphComponent currency1="WBTC" currency2="BNB" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="BNB" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 80002 ? (
          <>
            <GraphComponent currency1="USDC" currency2="MATIC" />
            <GraphComponent currency1="WBTC" currency2="MATIC" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="MATIC" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 421614 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ARB" />
            <GraphComponent currency1="WBTC" currency2="ARB" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ARB" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 4002 ? (
          <>
            <GraphComponent currency1="USDC" currency2="FTM" />
            <GraphComponent currency1="WBTC" currency2="FTM" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="FTM" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 43113 ? (
          <>
            <GraphComponent currency1="USDC" currency2="AVAX" />
            <GraphComponent currency1="WBTC" currency2="AVAX" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="AVAX" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 11155420 ? (
          <>
            <GraphComponent currency1="USDC" currency2="OPT" />
            <GraphComponent currency1="WBTC" currency2="OPT" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="OPT" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 59141 ? (
          <>
            <GraphComponent currency1="USDC" currency2="LINEAETH" />
            <GraphComponent currency1="WBTC" currency2="LINEAETH" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="LINEAETH" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 44787 ? (
          <>
            <GraphComponent currency1="USDC" currency2="CELO" />
            <GraphComponent currency1="WBTC" currency2="CELO" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="CELO" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 84532 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETHER" />
            <GraphComponent currency1="WBTC" currency2="ETHER" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETHER" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 168587773 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETHER" />
            <GraphComponent currency1="WBTC" currency2="ETHER" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETHER" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 1313161555 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETHER" />
            <GraphComponent currency1="WBTC" currency2="ETHER" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETHER" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 534351 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETHER" />
            <GraphComponent currency1="WBTC" currency2="ETHER" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETHER" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 1287 ? (
          <>
            <GraphComponent currency1="USDC" currency2="DEV" />
            <GraphComponent currency1="WBTC" currency2="DEV" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="DEV" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : chainId === 1 ? (
          <>
            <GraphComponent currency1="USDC" currency2="ETH" />
            <GraphComponent currency1="WBTC" currency2="ETH" />
            <GraphComponent currency1="DAI" currency2="USDC" />
            <GraphComponent currency1="USDT" currency2="ETH" />
            <GraphComponent currency1="USDC" currency2="USDT" />
          </>
        ) : (
          <></>
        )}
      </table>
    </TableContainer>
  );
}

//  NEW SCOMPONENTS
const TableContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 1214px;
  margin: 116px auto 0;
  max-width: calc(100% - 40px);
  box-shadow: 0px 9px 55.9px 9.1px rgba(27, 193, 154, 0.15);
  position: relative;
  z-index: 2;
  &:after {
    content: '';
    background: #bae1d8;
    position: absolute;
    top: 0;
    left: 50vw;
    margin-left: 250px;
    height: 500px;
    width: 500px;
    border-radius: 100%;
    z-index: -1;
    filter: blur(50px);
    opacity: 0.4;
  }
  table {
    width: 100%;
    th {
      text-align: left;
      padding: 0 30px;
      font-size: 20px;
      background: #e8f9f5;
      height: 60px;
      font-weight: 600;
      &[align='center'] {
        text-align: center;
      }
    }
    td {
      padding: 0 30px;
      font-size: 20px;
      height: 60px;
      height: 100px;
      border-bottom: 1px solid #e5e5e5;
      span {
        color: #e13046;
      }
      .chart {
        display: table;
        margin: 0px auto;
      }
      .coins {
        margin-right: 16px;
        img {
          margin-right: -8px;
          width: 25px;
          height: 25px;
          object-fit: contain;
        }
      }
    }
  }
  ${Media.sm} {
    table {
      display: block;
      thead {
        display: none;
      }
      tr {
        border-bottom: 1px solid #e5e5e5;
        padding: 10px 0;
        display: flex;
        flex-flow: wrap;
        td {
          display: block;
          width: 50%;
          height: auto;
          border-bottom: 0;
          font-size: 18px;
          padding: 10px 30px;
          &:before {
            content: attr(data-title);
            font-weight: 600;
            display: block;
            margin-bottom: 5px;
          }
          .chart {
            margin: 0;
          }
        }
      }
    }
  }
  ${Media.xs} {
    margin-top: 80px;
    table {
      tr {
        td {
          width: 100%;
          padding: 12px 20px;
          .chart {
            width: 100%;
          }
        }
      }
    }
  }
`;
const TbTop = styled.div`
  display: flex;
  width: 100%;
  padding: 22px 35px;
  h3 {
    font-size: 35px;
    margin: 0;
    font-weight: 600;
  }
  .TbTop-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    div > img {
      margin-top: 5px;
    }
    h4 {
      margin: 0;
      font-size: 20px;
      color: var(--primary);
      font-weight: 600;
    }
    p {
      margin: 0;
      color: var(--txtLight);
      font-size: 16px;
    }
    a {
      width: 30px;
      height: 30px;
      background: var(--primary);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 4px rgba(27, 193, 154, 0.2);
      margin-left: 14px;
      flex-shrink: 0;
    }
  }
  ${Media.md} {
    h3 {
      font-size: 28px;
    }
  }
  ${Media.sm} {
    border-bottom: 1px solid #e5e5e5;
    flex-flow: column;
  }
  ${Media.xs} {
    padding: 22px 20px;
    h3 {
      font-size: 25px;
      margin-bottom: 20px;
    }
    .TbTop-right {
      flex-flow: column;
      align-items: flex-start;
      div > img {
        margin: 0 0 0 -10px;
      }
      a {
        margin: 10px 0 0;
      }
    }
  }
`;
