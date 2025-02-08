import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SmallClockIcon = styled.div`
  width: 30px;
  height: 30px;
`;
export const Clock = styled.div`
  border-radius: 70px;
  border: 3px solid #ffa51e;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
  display: block;
  width: 120px;
  height: 120px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    background-color: #ffa51e;
    left: 48%;
    border-radius: 5px;
  }

  &:after {
    top: 13px;
    height: 50px;
    width: 4px;
    transform-origin: 50% 97%;
    animation: ${rotate360} 2s linear infinite;
  }

  &:before {
    top: 24px;
    height: 40px;
    width: 4px;
    transform-origin: 50% 94%;
    animation: ${rotate360} 12s linear infinite;
  }
`;
