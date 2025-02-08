import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Bridgecall } from './Bridgecall';
import styled, { ThemeContext } from 'styled-components';

import Column, { AutoColumn } from '../../components/Column';

// import SwapHeader from '../../components/swap/SwapHeader';
import CrossChainHeader from '../../components/swap/CrossChainHeader';
import { Wrapper } from '../../components/swap/styleds';

import AppBody from '../../components/CrossChainComponents/StyledComponents/AppBody/AppBody';
import SwapHeader from 'components/swap/SwapHeader';
import Media from 'theme/media-breackpoint';
import Gs from 'theme/globalStyles';

export default function Swap() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const PageWrap = styled.div`
    min-height: calc(100vh - 338px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60px;
  `;

  const ExchangeBg = styled.section`
    min-height: 100vh;
    background: #d0e6ea;
    position: relative;
    z-index: 2;
    h2 {
      color: var(--txtBlue);
      width: 100%;
      text-align: center;
      font-size: 24px;
      margin: 25px 0;
    }
    &:after {
      content: '';
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translate(-50%, 0%);
      background: var(--primary);
      width: 440px;
      height: 600px;
      z-index: -1;
      opacity: 0.1;
      filter: blur(80px);
    }
  `;
  const ExchangeBx = styled.section`
    border: 1px solid #fff;
    border-radius: 30px;
    box-shadow: 4px 0px 6px 2px rgba(0, 0, 0, 0.04);
    width: 440px; /* min-height: 634px; */
    background: rgba(255, 255, 255, 0.4);
    margin: 50px auto;
    padding: 26px 30px;
    max-width: 100%;
    ${Media.xs} {
      padding: 18px 18px;
      border-radius: 20px;
      height: auto;
    }
  `;

  return (
    <ExchangeBg>
      <Gs.Container>
        {/* <SwapHeader /> */}
        <ExchangeBx>
          <CrossChainHeader />
          <Bridgecall />
        </ExchangeBx>
      </Gs.Container>
    </ExchangeBg>
  );
}
