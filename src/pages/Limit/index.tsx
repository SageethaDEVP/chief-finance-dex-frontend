import React, { useState } from 'react';
import styled from 'styled-components';

import ControlPanel from './control';
import Chart from './chart';
import History from './history';

import { mobile_width } from '../../constants';
const PageWrap = styled.div`
  padding: 5px;
  display: flex;
  @media (max-width: ${mobile_width}px) {
    width: 100vw;
    flex-direction: column;
  }
  @media (min-width: ${mobile_width + 1}px) {
    max-width: 1356px;
    width: 100%;
    margin: auto;
    flex-direction: row;
  }
`;

const ControlWrapperParent = styled.div`
  position: relative;
  @media (min-width: ${mobile_width + 1}px) {
    flex: 0 1 456px;
  }
`;
const MainWrap = styled.div`
  @media (max-width: ${mobile_width}px) {
    flex: 1 0;
    flex-direction: column;
  }
  @media (min-width: ${mobile_width + 1}px) {
    flex: 2 0 auto;
  }
`;

export default function Limit() {
  const [isRefresh, setisRefresh] = useState(false);

  return (
    <PageWrap>
      <MainWrap>
        <Chart isRefresh={isRefresh} />
        <History />
      </MainWrap>
      <ControlWrapperParent>
        <ControlPanel />
      </ControlWrapperParent>
    </PageWrap>
  );
}
