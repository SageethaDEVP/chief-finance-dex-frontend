import React from 'react';
import Modal from '../Modal';
import styled from 'styled-components';
import CircleIcon from '../../assets/svg-bid/tick-circle.svg';
import { ExternalLink, TEXT } from '../../theme';
import { ButtonPrimary } from '../Button';
import { getEtherscanLink } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
import Copy from '../AccountDetails/Copy';
import { truncateString } from '../../utils/truncateString';

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

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;

  img {
    width: 45px;
    height: 45px;
  }
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
        <ImageWrapper>
          <img src={CircleIcon} alt="success" />
        </ImageWrapper>
        <TEXT.default fontWeight={600} fontSize={16} color="primary1" lineHeight="25.6px" marginTop="8px">
          Transaction success
        </TEXT.default>

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
