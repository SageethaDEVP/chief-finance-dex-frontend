import React from 'react';
import styled from 'styled-components';

export const CrossChainInputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 14px;
  z-index: 1;
  padding: '8px 10px 7px 8px';
  overflow: hidden;
  justify-content: space-around;
`;

export const Inputrow = styled.div`
  position: relative;
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.8rem 0.8rem 0.8rem 1.1rem;
  padding-left: 15px;
  width: 100%;
  max-width: 400px;
  background-color: #f3f4f7;
  border-radius: 10px;
  display: flex;
  flex-direction : column
  justify-content: flex-start;
`;

export const InputLabel = styled.span`
  top: 10px;
  left: 15px;
  font-weight: 500;
  font-size: 12px;
  color: #8192aa;

  input {
    border: none;
    width: 100%;
    height: 45px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 12px;
    font-size: 24px;
    padding-left: 0.75rem;
    padding: 8px;
    border: 1px solid #ccc;

    /* Hide the default arrow buttons in Chrome and Safari */
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Hide the arrows in Firefox */
    [type='number'] {
      -moz-appearance: textfield;
    }
  }
`;
