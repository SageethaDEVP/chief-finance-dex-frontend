import React from 'react';
import styled from 'styled-components';
import { ExternalLink, TEXT } from '../../theme';
import { useActiveWeb3React } from '../../hooks';
import { getEtherscanLink } from '../../utils';

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50px;
  right: 0;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.newTheme.bg3};
`;

const DropdownItem = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.newTheme.bg3};
  padding: 8px 10px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.newTheme.border2};
  }
`;

const Separator = styled.div`
  background-color: ${({ theme }) => theme.newTheme.border2};
  width: 100%;
  height: 1px;
`;

interface Props {
  isVisible: boolean;
  closeDropdown: () => void;
}

export default function AccountDropdown({ isVisible, closeDropdown }: Props) {
  const { chainId, account, deactivate } = useActiveWeb3React();

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('loggedIn');
    closeDropdown();
  };

  return (
    <>
      {isVisible && (
        <DropdownWrapper>
          <DropdownItem>
            {chainId && account && (
              <ExternalLink href={getEtherscanLink(chainId, account, 'address')} style={{ textDecoration: 'none' }}>
                <TEXT.default fontWeight={500} fontSize={12} color="text3">
                  Recent Transactions
                </TEXT.default>
              </ExternalLink>
            )}
          </DropdownItem>
          <Separator />
          <DropdownItem onClick={disconnect}>
            <TEXT.default fontSize={12} fontWeight={500} color="text3">
              Disconnect
            </TEXT.default>
          </DropdownItem>
        </DropdownWrapper>
      )}
    </>
  );
}
