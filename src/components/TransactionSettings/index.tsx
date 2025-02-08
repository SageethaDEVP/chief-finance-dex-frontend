import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import QuestionHelper from '../QuestionHelper';
import { TEXT } from '../../theme';
import { AutoColumn } from '../Column';
import { RowBetween } from '../Row';


import { darken } from 'polished';
import Gs from 'theme/globalStyles';

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 6px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: transparent;
`;

const Option = styled.a`
  color: var(--txtLight2);
  font-weight: 600;
  border-radius: 5px;
  border: 1px solid #baece1;
  text-align: center;
  padding: 4px 0;
  &:hover {
    border: 1px solid var(--primary);
  }
  &.active {
    color: #fff;
    background: var(--primary);
    border: 1px solid var(--primary);
    box-shadow: 0px 0px 7px rgba(27, 202, 161, 0.52);
  }
`;

const Input = styled.input`
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
  text-align: right;
`;

const OptionCustom = styled.div<{ active?: boolean; warning?: boolean }>``;

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`;

const TextRow = styled.div`
  display: flex;
  align-items: center;
`;

const OptionsWrapper = styled(RowBetween)`
  margin-top: 18px;
`;

export interface SlippageTabsProps {
  rawSlippage: number;
  setRawSlippage: (rawSlippage: number) => void;
}

export default function SlippageTabs({ rawSlippage, setRawSlippage }: SlippageTabsProps) {
  const inputRef = useRef<HTMLInputElement>();

  const [slippageInput, setSlippageInput] = useState('');

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);

  let slippageError: SlippageError | undefined;
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value);

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat);
      }
    } catch {}
  }

  return (
    <>
      <SecLabel>
        Slippage tolerance{' '}
        <QuestionHelper
          iconSize={20}
          text="Your transaction will revert if the price changes unfavorably by more than this percentage."
        />
      </SecLabel>

      <Gs.Percent>
        <Option
          onClick={() => {
            setSlippageInput('');
            setRawSlippage(10);
          }}
          className={rawSlippage === 10 ? 'active' : ''}
        >
          0.1%
        </Option>
        <Option
          onClick={() => {
            setSlippageInput('');
            setRawSlippage(50);
          }}
          className={rawSlippage === 50 ? 'active' : ''}
        >
          0.5%
        </Option>
        <Option
          onClick={() => {
            setSlippageInput('');
            setRawSlippage(100);
          }}
          className={rawSlippage === 100 ? 'active' : ''}
        >
          1%
        </Option>
        <OptionCustom active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
          {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
          <div className="inputBx">
            <input
              type="text"
              className=""
              ref={inputRef as any}
              placeholder={(rawSlippage / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((rawSlippage / 100).toFixed(2));
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              color={!slippageInputIsValid ? 'red' : ''}
            />
            <span style={{ marginLeft: '4px' }}>%</span>
          </div>
        </OptionCustom>
      </Gs.Percent>
      {!!slippageError && (
        <RowBetween
          style={{
            paddingTop: '7px',
          }}
        >
          <p style={{ fontSize: '14', color: 'red' }}>
            {slippageError === SlippageError.InvalidInput
              ? 'Enter a valid slippage percentage'
              : slippageError === SlippageError.RiskyLow
              ? 'Your transaction may fail'
              : 'Your transaction may be frontrun'}
            {!!slippageInput &&
            (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
              <SlippageEmojiContainer>
                <span role="img" aria-label="warning">
                  ⚠️
                </span>
              </SlippageEmojiContainer>
            ) : null}
          </p>
        </RowBetween>
      )}
    </>
  );
}

const SecLabel = styled.label`
  color: var(--txtLight);
  font-weight: 400;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  i {
    margin-left: 4px;
  }
`;
