import React from 'react';
import styled from 'styled-components';

export const WrapContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
`;

export const WrapSelect = styled.div`
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border-radius: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
`;

export const Pagewrap = styled.div`
  min-height: auto;
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
