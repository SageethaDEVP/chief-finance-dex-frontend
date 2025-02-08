import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Tooltip from '../Tooltip';
import HelpCircleIcon from '../../assets/svg-bid/help-circle.svg';
import InfoIco from '../../assets/images/info.png';

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const QuestionMark = styled.span`
  font-size: 1rem;
`;

export default function QuestionHelper({ text, iconSize = 14 }: { text: string; iconSize?: number }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 8 }}>
      <Tooltip text={text} show={show} placement="bottom-start">
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <img src={InfoIco} width={`${iconSize}px`} height={`${iconSize}px`} alt="help" />
        </QuestionWrapper>
      </Tooltip>
    </span>
  );
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <QuestionMark>?</QuestionMark>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  );
}
