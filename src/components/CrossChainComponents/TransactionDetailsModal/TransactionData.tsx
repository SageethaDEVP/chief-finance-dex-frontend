import React, { useRef, useState } from 'react';
import { TEXT } from '../../../theme';
import Column, { AutoColumn } from '../../Column';
import { RowBetween } from '../../Row';
import { PaddedColumn } from '../../SearchModal/styleds';
import styled from 'styled-components';
import useToggle from 'hooks/useToggle';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import useTheme from 'hooks/useTheme';
import CloseSvgIcon from '../../../assets/svg-bid/close-small.svg';
import ClockIcon from '../../../assets/svg-bid/clock.svg';
import Modal from '../../Modal';
import CircleIcon from '../../../assets/svg-bid/tick-circle.svg';
import { ExternalLink } from '../../../theme';
import { ButtonPrimary } from '../../Button';
import { getEtherscanLink } from '../../../utils';
import { useActiveWeb3React } from '../../../hooks';
import Copy from '../../AccountDetails/Copy';
import { truncateString } from '../../../utils/truncateString';
// import { Clock } from '../StyledComponents/ClockLoader';
import Gs from 'theme/globalStyles';
import Media from 'theme/media-breackpoint';
import Clock from '../../../assets/images/clock.png';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.newTheme.white};
`;

const TransactionButton = styled(ButtonPrimary)`
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 18px;
`;

const HashInfoSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.newTheme.border3};
  border-radius: 8px;
`;

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
}

export function SuccessTransactionModal({ isOpen, onDismiss, hash }: Props) {
  const { chainId } = useActiveWeb3React();
  
  const truncatedHash = hash !== undefined ? truncateString(hash) : hash;

  if (!chainId) return null;

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={60} maxWidth={345}>
      <Wrapper>
        {/* On Transaction pending */}
        <ImageWrapper>
          <img src={ClockIcon} alt="pending" />
        </ImageWrapper>
        <TEXT.default fontWeight={600} fontSize={16} color="#f2994a" lineHeight="25.6px" marginTop="8px">
          Transaction pending
        </TEXT.default>
        {/* On Transaction success */} 
        {/* <ImageWrapper>
          <img src={CircleIcon} alt="success" />
        </ImageWrapper>
        <TEXT.default fontWeight={600} fontSize={16} color="#1bc19a" lineHeight="25.6px" marginTop="8px">
          Transaction Success
        </TEXT.default> */}

        {hash !== undefined && (
          <TEXT.default fontWeight={500} fontSize={14} color="textPrimary" marginTop="20px">
            Transaction hash
          </TEXT.default>
        )}

        {hash !== undefined && (
          <HashInfoSection>
            <TEXT.default fontWeight={600} fontSize={12} color="#335BE9" flex={0.8}>
              {truncatedHash}
            </TEXT.default>
            <Copy toCopy={hash} />
          </HashInfoSection>
        )}

        {chainId && hash && (
          <TEXT.default fontWeight={500} fontSize={14} color="textPrimary" marginTop="10px">
            View your transaction in
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ display: 'inline' }}>
              <TEXT.default fontWeight={500} fontSize={14} color="#335BE9" display="inline">
                {' '}
                Explorer
              </TEXT.default>
            </ExternalLink>
          </TEXT.default>
        )}
        <ButtonWrapper>
          <TransactionButton onClick={onDismiss}>
            <TEXT.default fontWeight={600} fontSize={14} color="white">
              Ok
            </TEXT.default>
          </TransactionButton>
        </ButtonWrapper>
      </Wrapper>
    </Modal>
  );
}
const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  img {
    width: 50px;
    height: 50px;
  }
`;
const ContentWrapper = styled(Column)`
  width: 100%;
  position: relative;
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 0;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const HeaderSection = styled(RowBetween)`
  position: relative;
  justify-content: center;
`;

interface TransactionDataProps {
  isOpen: boolean;
  onDismiss: (diss: boolean) => void;
}

export function TransactionData({ onDismiss, isOpen }: TransactionDataProps) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  const callbackRef = (element: HTMLDivElement) => {
    if (!element) return;

    const modalHeight = element?.getBoundingClientRect().height;

    // if (modalHeight >= 576) {
    //   setListHeight(448);
    // } else if (modalHeight >= 513) {
    //   setListHeight(392);
    // } else {
    //   setListHeight(336);
    // }
  };

  return (
    <>
      <Gs.PopupMain>
        <Gs.Popup>
          <Waiting>
            <img width={55} src={Clock} alt="pending" />
            <h4>Waiting For Confirmation</h4>

            <p>Confirm this transaction in your wallet</p>
          </Waiting>
          <Gs.BtnSm className="lg" style={{ cursor: 'pointer' }} onClick={() => onDismiss(false)}>
            Close
          </Gs.BtnSm>
        </Gs.Popup>
      </Gs.PopupMain>
    </>
  );
}

const Waiting = styled.div`
  text-align: center;
  margin-bottom: 30px;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--txtYellow);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
  p {
    color: var(--txtLight);
    font-size: 20px;
    font-weight: 400;
    margin: 16px 0 0;
  }
  span {
    color: var(--primary);
  }
  b {
    font-weight: 500;
  }
  ${Media.xs} {
    margin-bottom: 20px;
    p {
      margin-top: 10px;
    }
  }
`;
