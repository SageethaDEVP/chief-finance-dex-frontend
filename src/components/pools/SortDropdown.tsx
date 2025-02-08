import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { TEXT } from '../../theme';
import UpIcon from '../../assets/svg-bid/vector-up-grey.svg';
import { darken } from 'polished';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const Wrapper = styled.div`
  position: absolute;
  margin-top: 6px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  border-radius: 12px;
  width: 100%;
  max-width: 126px;
`;

const SortOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  line-height: 23px;
  padding: 8px 15px;
  background-color: ${({ theme }) => theme.newTheme.white};

  :hover {
    background-color: ${({ theme }) => darken(0.03, theme.newTheme.white)};
  }
`;

const DividerContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.white};
  padding: 0 15px;
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.newTheme.border3};
`;

const Icon = styled.div<{ rotate: string }>`
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  transform: ${({ rotate }) => (rotate === 'true' ? 'rotate(180deg)' : '')};
`;

export default function SortDropdown() {
  const node = useRef<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>('High profit');

  const toggle = () => setIsOpen((prev) => !prev);

  const setValue = (value: string) => {
    setCurrentValue(value);
    setIsOpen(false);
  };

  useOnClickOutside(node, isOpen ? toggle : undefined);

  return (
    <Wrapper ref={node as any}>
      <SortOption onClick={toggle}>
        <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
          {currentValue}
        </TEXT.default>
        <Icon rotate={String(isOpen)}>
          <img src={UpIcon} alt="up" />
        </Icon>
      </SortOption>
      {isOpen && (
        <>
          <DividerContainer>
            <Divider />
          </DividerContainer>
          <SortOption onClick={() => setValue('All')}>
            <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
              All
            </TEXT.default>
          </SortOption>
          <SortOption onClick={() => setValue('High profit')}>
            <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
              High profit
            </TEXT.default>
          </SortOption>
          <SortOption onClick={() => setValue('Low profit')}>
            <TEXT.default fontWeight={500} fontSize={14} color="textSecondary">
              Low profit
            </TEXT.default>
          </SortOption>
        </>
      )}
    </Wrapper>
  );
}
