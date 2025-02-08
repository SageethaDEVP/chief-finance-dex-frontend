import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';

const StyledSwapHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
  color: ${({ theme }) => theme.newTheme.primary2};
`;

export default function SwapHeader() {
  return <h2>Exchange (DeFi)</h2>;
}
