import { Text } from 'rebass';
import styled from 'styled-components';
import { AutoColumn } from '../../components/Column';
import { ButtonOutlined } from '../../components/Button';

export const Wrapper = styled.div`
  position: relative;
`;

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`;
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  transition: 0.2s;

  :hover {
    opacity: 0.6;
  }

  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
`;

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

export const LiquidityIconWrapper = styled.div`
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
`;

export const LiquidityInfoCard = styled.div`
  margin-top: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border-radius: 10px;
`;

export const FlexAlign = styled.div`
  display: flex;
  align-items: center;
`;

export const SliderWrapper = styled(AutoColumn)`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  border-radius: 14px;
`;

export const InfoCard = styled.div`
  border-radius: 10px;
  padding: 16px;
  background-color: ${({ theme }) => theme.newTheme.bg7};
`;

export const ButtonOutlinedRemove = styled(ButtonOutlined)`
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 10px;
`;
