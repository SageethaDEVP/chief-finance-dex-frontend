import React, { Suspense, useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import AddLiquidity from './AddLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './AddLiquidity/redirects';
import Pool from './Pool';
import RemoveLiquidity from './RemoveLiquidity';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import Swap from './Swap';
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly } from './Swap/redirects';
import NavTabs from '../components/NavTabs';
import { useLanguage, useUserBlockedModalOpen, useUserBlockedModalToggle } from '../state/application/hooks';
import { changeLanguage } from '../i18n';
import Home from './Home';
import Pools from './Pools';
import Bridge from './Bridge/index';
// import PrivacyPolicy from './PrivacyPolicy';
import ServiceAgreement from './ServiceAgreement';
import Faq from './Faq';
import Footer from '../components/Footer';
import { UserBlockedModal } from './AddLiquidity/modals';
import { useHistory } from 'react-router-dom';
import Limit from './Limit';

import { RedirectPathToLimitOnly } from './Limit/redirects';
import Gs from '../theme/globalStyles';
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
const AppWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.newTheme.bg4};
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div<{ isPadding: boolean }>`
  width: 100%;
  padding: ${({ isPadding }) => (isPadding ? '1.5rem 0 0 0' : '')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`;

export default function App() {
  const history = useHistory();
  const currentPath = history.location.pathname;
  const isBridgePage = currentPath === '/bridge';

  const language = useLanguage();
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const isErrorModalOpen = useUserBlockedModalOpen();
  const toggleErrorModal = useUserBlockedModalToggle();

  const showTabs =
    location.pathname === '/' ||
    location.pathname === '/privacy' ||
    location.pathname === '/faq' ||
    location.pathname === '/service';

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (headerRef.current && !showTabs) {
      headerRef.current?.scrollIntoView();
    }
  }, [showTabs]);

  return (
    <Suspense fallback={null}>
      <Route component={DarkModeQueryParamReader} />
      {/* <AppWrapper> */}
      <section className="MainBox clearfix">
        <Gs.GlobalStyle />
        {!showTabs && (
          <HeaderWrapper ref={headerRef}>
            <Header showBottom={true} />
          </HeaderWrapper>
        )}

        {/* {!isBridgePage && !showTabs && <NavTabs />} */}

        {/* <BodyWrapper isPadding={!showTabs}> */}

        <UserBlockedModal isOpen={isErrorModalOpen} onDismiss={toggleErrorModal} />
        <Popups />
        <Web3ReactManager>
          <Switch>
            <Route exact strict path="/" component={Home} />
            {/* <Route exact strict path="/privacy" component={PrivacyPolicy} /> */}
            <ExchangeBg>
              <Route exact strict path="/service" component={ServiceAgreement} />
              <Route exact strict path="/faq" component={Faq} />
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/limit" component={Limit} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/pools" component={Pools} />
              <Route exact strict path="/pools:list" component={Pools} />
              <Route exact strict path="/bridge" component={Bridge} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/limit/:outputCurrency" component={RedirectPathToLimitOnly} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              {/* <Route component={RedirectPathToSwapOnly} /> */}
            </ExchangeBg>
          </Switch>
        </Web3ReactManager>
        {/* </BodyWrapper> */}
        {!showTabs && !isBridgePage && <Footer />}
        {isBridgePage && <Footer />}

        {location.pathname === '/faq' && <Footer />}
      </section>
      {/* </AppWrapper> */}
    </Suspense>
  );
}
