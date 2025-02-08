import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import Media from 'theme/media-breackpoint';
import Gs from 'theme/globalStyles';

const StyledSwapHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
  color: ${({ theme }) => theme.newTheme.primary2};
`;

export default function SwapHeader() {
  return <PageTitle>Cross Chain Exchange</PageTitle>;
}

const PageTitle = styled.h3`
  font-size: 24px;
  font-weight: 500;
  color: #000;
  margin: 0 0 21px;
  text-align: center;
`;
