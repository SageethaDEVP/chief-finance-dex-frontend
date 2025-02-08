import React from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';

const StyledSwapHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  margin-bottom: 1rem;
  width: 100%;
  color: ${({ theme }) => theme.newTheme.primary2};
`;

export default function LimitHeader() {
  return <PageTitle>Limit Order</PageTitle>;
}

const PageTitle = styled.h3`
  font-size: 24px;
  font-weight: 500;
  color: #000;
  margin: 0 0 21px;
  text-align: center;
`;
