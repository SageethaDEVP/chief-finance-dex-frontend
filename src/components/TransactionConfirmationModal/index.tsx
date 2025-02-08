import { ChainId, Pair, Trade } from '@bidelity/sdk';
import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { ExternalLink, TEXT } from '../../theme';
import { RowBetween } from '../Row';
import { ButtonPrimary } from '../Button';
import { AutoColumn, ColumnCenter } from '../Column';
import confirmIco from '../../assets/images/confirm.png';

import { getEtherscanLink } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
// import CloseSvgIcon from '../../assets/svg-bid/close-small.svg';
import CloseSvgIcon from '../../assets/images/cross.png';
import failIcon from '../../assets/images/fail.png';

import ClockIcon from '../../assets/svg-bid/clock.svg';
import ErrorIcon from '../../assets/svg-bid/error.svg';
import CircleIcon from '../../assets/svg-bid/tick-circle.svg';
import ExportIcon from '../../assets/svg-bid/export.svg';
import ApproveTokensIcon from '../../assets/images/waiting.png';
// import ApproveTokensIcon from '../../assets/svg-bid/approve-tokens-image.svg';
import MetamaskIcon from '../../assets/images/metamask.png';
import { darken } from 'polished';
import { PairState } from '../../data/Reserves';
import cross from '../../assets/images/cross.png';
import Gs from 'theme/globalStyles';
import Media from 'theme/media-breackpoint';
import Clock from '../../assets/images/clock.png';

const TransactionButton = styled(ButtonPrimary)`
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
`;

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.white};
`;

const WrapperSecondary = styled(Wrapper)`
  padding: 24px;
`;

const Section = styled(AutoColumn)`
  padding: 30px 30px 0px;
`;

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 0px 30px 23px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  margin-top: 40px;
  img {
    width: 50px;
    height: 50px;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 10px;

  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const TitleSection = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 18px;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`;

const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const PendingSectionSecondary = styled(PendingSection)`
  border: 1px solid ${({ theme }) => theme.newTheme.border3};
  border-radius: 14px;
`;

const TopSection = styled(RowBetween)`
  position: relative;
  padding: 10px 3px 4px;
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

const Image = styled.div`
  display: flex;
  justify-content: center;
  img {
    width: 60px;
    height: 60px;
  }
`;

const ImageWrapperBig = styled(ImageWrapper)`
  img {
    width: 263px;
    height: 228px;
  }
`;

const ErrorSection = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ConfirmTxt = styled.div`
  text-align: center;
  margin: 15px 0;
  img {
    margin-bottom: 12px;
  }
  h4 {
    color: var(--primary);
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  p {
    color: var(--txtLight);
    font-size: 18px;
    font-weight: 400;
    margin: 10px 0 0;
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
`;
const WalletSection = styled.div`
  margin-top: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.newTheme.bg2};
  border-radius: 14px;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => darken(0.04, theme.newTheme.bg2)};
  }
`;

const AddToMetamaskSection = styled(WalletSection)`
  margin-top: 24px;
  background-color: ${({ theme }) => theme.newTheme.primary1};

  :hover {
    background-color: ${({ theme }) => darken(0.02, theme.newTheme.primary1)};
  }
`;

const WalletIcon = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${({ theme }) => theme.newTheme.white};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.newTheme.border3};

  img {
    width: 20px;
    height: 20px;
  }
`;
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
function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  pendingContent,
}: {
  onDismiss: () => void;
  pendingText: string;
  pendingContent?: () => React.ReactNode;
}) {
  return (
    <Gs.PopupMain>
      <Gs.Popup>
        <Waiting>
          <img width={55} src={Clock} alt="pending" />
          <h4>Waiting For Confirmation</h4>
          {pendingContent ? (
            pendingContent()
          ) : (
            <p>
              <b> {pendingText}</b>
            </p>
          )}
          <p>Confirm this transaction in your wallet</p>
        </Waiting>
        <Gs.BtnSm className="lg" style={{ cursor: 'pointer' }} onClick={onDismiss}>
          Close
        </Gs.BtnSm>
      </Gs.Popup>
    </Gs.PopupMain>
  );
}

export function ApproveTokensContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  return (
    <Gs.PopupMain>
      <Gs.OverLay onClick={onDismiss} />
      <Gs.Popup>
        <h3>
          Approve Tokens
          <a className="close" onClick={onDismiss} style={{ cursor: 'pointer' }}>
            <img width={12} src={CloseSvgIcon} alt="close" />
          </a>
        </h3>
        <Wait>
          <img src={ApproveTokensIcon} alt="pending" />
          <h4>Waiting For Confirmation</h4>
          <p className="color-dark">{pendingText}</p>
          <p>Confirm this transaction in your wallet</p>
        </Wait>
      </Gs.Popup>
    </Gs.PopupMain>
  );
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  v2pair,
  pair,
  isRemove,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  trade?: Trade | undefined;
  v2pair?: [PairState, Pair | null];
  pair?: Pair | null | undefined;
  isRemove?: boolean;
}) {
  let address: string;
  let decimals: number;
  let symbol: string | undefined;

  if (v2pair && v2pair[1]?.liquidityToken) {
    const lpToken = v2pair[1]?.liquidityToken;

    address = lpToken?.address;
    decimals = lpToken?.decimals;
    symbol = lpToken?.symbol;
  } else if (pair && pair.liquidityToken) {
    address = pair.liquidityToken?.address;
    decimals = pair.liquidityToken?.decimals;
    symbol = pair.liquidityToken?.symbol;
  }

  const { library } = useActiveWeb3React();

  const callback = (error: any, response: any) => console.debug(error);

  const addToMetamask = () => {
    if (library) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      library?.provider.send(
        {
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: address,
              symbol: symbol,
              decimals: decimals,
            },
          } as any,
        },
        callback
      );
    }
  };

  if (isRemove) {
    return (
      <WrapperSecondary>
        <AutoColumn gap="xl">
          <RowBetween>
            <div />
            <TEXT.primary fontSize={20} fontWeight={600}>
              You will receive
            </TEXT.primary>
            <div onClick={onDismiss} style={{ cursor: 'pointer' }}>
              <img src={CloseSvgIcon} alt="close" />
            </div>
          </RowBetween>
          <PendingSectionSecondary>
            <ConfirmedIcon>
              <img src={ExportIcon} alt="confirmed" />
            </ConfirmedIcon>
            <AutoColumn gap="14px">
              <AutoColumn gap="10px" justify={'center'}>
                <TEXT.primary fontWeight={600} fontSize={16}>
                  Transaction Submitted
                </TEXT.primary>
                {chainId && hash && (
                  <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
                    <TEXT.default fontWeight={600} fontSize={14} color="blue">
                      View on EtherScan
                    </TEXT.default>
                  </ExternalLink>
                )}
              </AutoColumn>
              <WalletSection onClick={addToMetamask}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <TEXT.default fontWeight={700} fontSize={12} color="primary1">
                    Add {symbol} to Metamask
                  </TEXT.default>
                </div>
                <WalletIcon>
                  <img src={MetamaskIcon} alt="icon" />
                </WalletIcon>
              </WalletSection>
            </AutoColumn>
          </PendingSectionSecondary>
          <ButtonWrapper>
            <TransactionButton onClick={onDismiss}>
              <TEXT.default fontWeight={600} fontSize={14} color="white">
                Close
              </TEXT.default>
            </TransactionButton>
          </ButtonWrapper>
        </AutoColumn>
      </WrapperSecondary>
    );
  }

  return (
    <Wrapper>
      <PendingSection>
        <Gs.PopupMain>
          <Gs.OverLay onClick={onDismiss} />
          <Gs.Popup>
            <ConfirmTxt>
              <img width={45} src={confirmIco} alt="confirmed" />
              <h4>Confirmed</h4>
              {chainId && hash && (
                <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
                  <p>
                    <a style={{ color: '#005ece' }} className="color-blue">
                      View in Explorer
                    </a>
                  </p>
                </ExternalLink>
              )}
            </ConfirmTxt>
          </Gs.Popup>
        </Gs.PopupMain>

        {symbol !== undefined && (
          <AddToMetamaskSection onClick={addToMetamask}>
            <div style={{ flex: 0.8 }}>
              <p style={{ fontWeight: '500', fontSize: '14', color: 'white' }}>
                Add {symbol} to MetaMask as a new token
              </p>
            </div>
            <WalletIcon>
              <img src={MetamaskIcon} alt="icon" />
            </WalletIcon>
          </AddToMetamaskSection>
        )}
      </PendingSection>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Section>
        <TitleSection>
          <h3 style={{ fontSize: '21px', margin: 0 }}>{title}</h3>
          <CloseIcon onClick={onDismiss}>
            <img width={12} src={cross} alt="cross" />
          </CloseIcon>
        </TitleSection>
        {topContent()}
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  );
}

export function TransactionErrorContent({
  message = 'Transaction failed.',
  buttonText = 'Dismiss',
  onDismiss,
}: {
  message?: string;
  buttonText?: string;
  onDismiss: () => void;
}) {
  return (
    <>
      <Gs.PopupMain>
        <Gs.OverLay onClick={onDismiss} />
        <Gs.Popup>
          <FailedTxt>
            <img width={58} src={failIcon} alt="error" />
            <h4> {message}</h4>
            <Gs.BtnSm onClick={onDismiss} className="lg">
              {buttonText}
            </Gs.BtnSm>
          </FailedTxt>
        </Gs.Popup>
      </Gs.PopupMain>
    </>
  );
}

const FailedTxt = styled.div`
  text-align: center;
  margin: 15px 0;
  img {
    margin-bottom: 25px;
  }
  h4 {
    color: #ff0000;
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 28px;
  }
  p {
    color: var(--txtLight);
    font-size: 18px;
    font-weight: 400;
    margin: 10px 0 0;
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
`;
interface TokenModalProps {
  onDismiss: () => void;
  icon: typeof CircleIcon;
  title: string;
  text: string;
}

export function TokenAddedModalContent({ onDismiss, title, text, icon }: TokenModalProps) {
  return (
    <Wrapper style={{ padding: '18px' }}>
      <AutoColumn gap="16px">
        <RowBetween>
          <div />
          <div />
          <div onClick={onDismiss} style={{ cursor: 'pointer' }}>
            <img src={CloseSvgIcon} alt="close" />
          </div>
        </RowBetween>
        <Image>
          <img src={icon} alt="error" />
        </Image>
        <TEXT.primary fontWeight={600} fontSize={20} textAlign="center">
          {title}
        </TEXT.primary>
        <TEXT.primary fontWeight={500} fontSize={14} textAlign="center">
          {text}
        </TEXT.primary>
        <TransactionButton onClick={onDismiss}>Confirm</TransactionButton>
      </AutoColumn>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  pendingContent?: () => React.ReactNode;
  trade?: Trade | undefined;
  v2pair?: [PairState, Pair | null];
  isAddLiquidityPage?: boolean;
  pair?: Pair | null | undefined;
  isRemove?: boolean;
  isLimitPage?: boolean | undefined;
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  pendingContent,
  trade,
  isAddLiquidityPage,
  v2pair,
  pair,
  isRemove,
  isLimitPage,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxHeight={isLimitPage ? 856 : 90}
      maxWidth={isLimitPage ? 436 : attemptingTxn || hash || isAddLiquidityPage ? 345 : 380}
    >
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} pendingContent={pendingContent} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          trade={trade}
          v2pair={v2pair}
          pair={pair}
          isRemove={isRemove}
        />
      ) : (
        content()
      )}
    </Modal>
  );
}

const Wait = styled.div`
  text-align: center;
  margin-bottom: 30px;
  img {
    margin: 19px 0 62px 0;
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
    margin: 10px 0 0;
    &.color-dark {
      color: var(--txtColor);
      font-weight: 500;
    }
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
