import React from 'react';
import Modal from '../Modal';
import styled from 'styled-components';
import CircleIcon from '../../assets/svg-bid/tick-circle.svg';
import { ExternalLink, TEXT } from '../../theme';
import { ButtonPrimary } from '../Button';
import { getEtherscanLink } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
import Copy from '../AccountDetails/Copy';
import Copyimg from '../../assets/images/copy.png';

import { truncateString } from '../../utils/truncateString';
import Gs from 'theme/globalStyles';
import Tick from '../../assets/images/tick.png';
import Media from 'theme/media-breackpoint';

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
        <Gs.PopupMain>
          <Gs.Popup>
            <SuccessTxt>
              <img width={55} src={Tick} alt="success" />
              <h4>Transaction Success</h4>

              {hash !== undefined && <p>Transaction hash</p>}

              {hash !== undefined && (
                <TextBox>
                  <input
                    style={{ color: '#335BE9', flex: '0.8' }}
                    type="text"
                    name="address"
                    value={truncatedHash}
                    placeholder=""
                  ></input>
                  <Copy toCopy={hash} />
                </TextBox>
              )}

              {chainId && hash && (
                <p>
                  View your transaction in
                  <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ display: 'inline' }}>
                    <a className="color-blue"> Explorer</a>
                  </ExternalLink>
                </p>
              )}
            </SuccessTxt>
            <Gs.BtnSm className="lg" onClick={onDismiss}>
              Ok
            </Gs.BtnSm>
          </Gs.Popup>
        </Gs.PopupMain>
      </Wrapper>
    </Modal>
  );
}

const SuccessTxt = styled.div`
  text-align: center;
  margin-bottom: 30px;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--primary);
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
  .color-blue {
    color: var(--txtBlue);
  }
  ${Media.xs} {
    margin-bottom: 20px;
    p {
      margin-top: 10px;
    }
  }
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-flow: row;
  position: relative;
  margin-top: 14px;
  label {
    color: var(--txtLight);
    font-size: 14px;
    margin-bottom: 8px;
  }
  input {
    color: var(--txtBlue);
    background: var(--bgLight);
    border: 0;
    border-radius: 5px;
    height: 65px;
    font-weight: 500;
    padding: 8px 12px;
    font-weight: 500;
  }
  .copy {
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -10px;
  }
  ${Media.xs} {
    input {
      height: 50px;
    }
  }
`;
