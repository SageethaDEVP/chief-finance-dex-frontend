import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { darken, lighten } from 'polished';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Activity } from 'react-feather';
import styled from 'styled-components';
import Gs from '../../theme/globalStyles';
import WalletIco from '../../assets/images/wallet.png';
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg';
// import FortmaticIcon from '../../assets/images/fortmaticIcon.png';
// import PortisIcon from '../../assets/images/portisIcon.png';
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg';
import {
  // fortmatic,
  injected,
  //portis,
  walletconnect,
  walletlink,
} from '../../connectors';
import { NetworkContextName } from '../../constants';
import useENSName from '../../hooks/useENSName';
import { useWalletModalToggle } from '../../state/application/hooks';
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks';
import { TransactionDetails } from '../../state/transactions/reducer';
import { shortenAddress } from '../../utils';
import { ButtonSecondary, StyledButton } from '../Button';

import Identicon from '../Identicon';
import Loader from '../Loader';

import { RowBetween } from '../Row';
import WalletModal from '../WalletModal';
import { useTranslation } from 'react-i18next';
import { TEXT } from '../../theme';
import AccountDropdown from '../AccountDropdown';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { switchNetwork } from '../../utils/switchNetwork';
import Media from 'theme/media-breackpoint';
import { Network_Url } from 'constants/contractConstants';

const ConnectedButton = styled.a<{ pending?: boolean }>`
  background: var(--primary);
  padding: 0 26px;
  margin: 0 auto;
  height: 45px;
  text-align: center;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease-in-out 0s;
  line-height: 1;
  img {
    margin-right: 6px;
  }
  &.lg {
    width: 100%;
  }
  &:hover {
    background: var(--txtColor);
  }
  &.secondary {
    background: none;
    border: 1px solid var(--txtLight2);
    color: var(--txtLight);
    &:hover {
      border: 1px solid var(--txtColor);
      background: var(--txtColor);
      color: #fff;
    }
  }
  ${Media.lg2} {
    padding: 0 20px;
  }
  ${Media.md} {
  }
`;
const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.4rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`;

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  color: ${({ theme }) => theme.newTheme.white};
  font-weight: 600;
  border: none;
  outline: none;
  border-radius: 8px;
  padding: 14px 34px 14px;
  }
`;

const Text = styled.p`
  flex: 1 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.3rem;
  width: fit-content;
  font-weight: 500;
`;

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;

interface InnerProps {
  toggleDropdown: () => void;
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />;
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    );
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    );
  }

  return null;
}

function Web3StatusInner({ toggleDropdown }: InnerProps) {
  const { account, connector, error, chainId } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;
  const toggleWalletModal = useWalletModalToggle();

  const handleWrongNetwork = () => {
    toggleWalletModal();
    switchNetwork(
      11155111,
      'Sepolia TestNet',
      Network_Url[11155111],
      'https://etherscan.io',
      'Wrapped ETH',
      'WETH',
      18
    );
  };

  const { t } = useTranslation();

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={toggleDropdown} pending={hasPendingTransactions}>
        {!hasPendingTransactions && connector && (
          <div style={{ marginRight: 10 }}>
            <StatusIcon connector={connector} />
          </div>
        )}
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            <TEXT.default fontWeight={600} fontSize={12} color="white">
              {ENSName || shortenAddress(account)}
            </TEXT.default>
          </>
        )}
      </Web3StatusConnected>
    );
  } else if (error) {
    return (
      <Gs.BtnSm className="lg error" onClick={handleWrongNetwork}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Gs.BtnSm>
    );
  } else {
    return (
      <Gs.BtnSm id="connect-wallet" style={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
        <img src={WalletIco} alt="Wallet" />
        {t('connect wallet')}
      </Gs.BtnSm>
    );
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);
  const { ENSName } = useENSName(account ?? undefined);
  const allTransactions = useAllTransactions();

  const node = useRef<HTMLDivElement>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash);

  useOnClickOutside(node, isDropdownOpen ? toggleDropdown : undefined);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <div ref={node as any} style={{ position: 'relative' }}>
      <Web3StatusInner toggleDropdown={toggleDropdown} />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      <AccountDropdown closeDropdown={closeDropdown} isVisible={isDropdownOpen} />
    </div>
  );
}
