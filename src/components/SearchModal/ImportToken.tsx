import React, { useState } from 'react';
import { Token, Currency } from '@bidelity/sdk';
import styled from 'styled-components';
import { TEXT } from 'theme';
import { AutoColumn } from 'components/Column';
import { RowBetween } from 'components/Row';

import { ButtonPrimary } from 'components/Button';
import { useAddUserToken } from 'state/user/hooks';
import { getEtherscanLink } from 'utils';
import { useActiveWeb3React } from 'hooks';
import { ExternalLink } from '../../theme/components';
import ArrowLeftIcon from '../../assets/svg-bid/arrow-left-grey.svg';
import CloseIcon from '../../assets/svg-bid/close-small.svg';
import { Text } from 'rebass';
import DangerIcon from '../../assets/svg-bid/danger.svg';
import WarningIcon from '../../assets/svg-bid/warning.svg';
import CheckBoxIcon from '../../assets/svg-bid/checkbox.svg';
import cross from '../../assets/images/cross.png';
import leftArrow from '../../assets/images/leftArrow.png';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 16px;
`;

const Button = styled(ButtonPrimary)`
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 23.1px;
  border-radius: 10px;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.newTheme.bg7};
  border-radius: 14px;
  padding: 16px;
  display: flex;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const CustomCheckBox = styled.div<{ confirmed: string }>`
  position: relative;
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.newTheme.white};
  border: ${({ theme, confirmed }) => (confirmed === 'false' ? '1px solid' + theme.newTheme.primary1 : 'none')};
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 20px;
    height: 20px;
  }
`;

interface ImportProps {
  tokens: Token[];
  onBack?: () => void;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

const truncateAddress = (str: string): string => {
  return str.slice(0, 4) + '..' + str.slice(str.length - 4, str.length);
};

export function ImportToken({ tokens, onBack, onDismiss, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React();

  const [confirmed, setConfirmed] = useState(false);

  const addToken = useAddUserToken();

  return (
    <Wrapper>
      <AutoColumn gap="xl">
        <RowBetween style={{ alignItems: 'center' }}>
          {onBack ? (
            <a onClick={onBack}>
              <img width={20} src={leftArrow} alt="back" />
            </a>
          ) : (
            <div />
          )}
          <Text fontWeight={500} fontSize={20}>
            Add your token
          </Text>
          {onDismiss ? (
            <a onClick={onDismiss}>
              <img src={CloseIcon} alt="close" />
            </a>
          ) : (
            <div />
          )}
        </RowBetween>

        <InfoCard>
          <div>
            <img src={DangerIcon} alt="danger" />
          </div>
          <div style={{ flex: 1, marginLeft: '10px' }}>
            <TEXT.primary fontSize={12} fontWeight={500} lineHeight="20.4px">
              Anyone can create a ERC-20 token on CFNC with any name, including creating fake versions of existing
              tokens and tokens that claim to represent projects that do not have a token.
            </TEXT.primary>
            <TEXT.primary fontSize={12} fontWeight={500} lineHeight="20.4px" marginTop="14px">
              If you purchase an arbitrary token, you may be unable to sell is back.
            </TEXT.primary>
          </div>
        </InfoCard>

        <Flex>
          <img src={WarningIcon} alt="warning" />
          <TEXT.default fontSize={12} fontWeight={500} lineHeight="20.4px" color="error" marginLeft="8px">
            Unknown Source
          </TEXT.default>
        </Flex>

        <div>
          {tokens.map((token) => {
            return (
              <div key={'import' + token.address}>
                <TEXT.primary fontSize={14} fontWeight={600} lineHeight="23.1px">
                  {token.symbol} ({token.symbol})
                </TEXT.primary>
                <RowBetween>
                  <TEXT.primary fontSize={14} fontWeight={600} lineHeight="23.1px">
                    {truncateAddress(token.address)}
                  </TEXT.primary>
                  <ExternalLink href={chainId ? getEtherscanLink(chainId, token.address, 'address') : ''}>
                    <TEXT.default fontWeight={600} fontSize={12} color="primary1">
                      (View on EtherScan)
                    </TEXT.default>
                  </ExternalLink>
                </RowBetween>
              </div>
            );
          })}
        </div>

        <Flex style={{ cursor: 'pointer' }} onClick={() => setConfirmed(!confirmed)}>
          <CustomCheckBox confirmed={String(confirmed)} onClick={() => setConfirmed(!confirmed)}>
            {confirmed && <img src={CheckBoxIcon} alt="check" />}
          </CustomCheckBox>
          <TEXT.secondary fontSize={12} fontWeight={500} lineHeight="20.4px" marginLeft="8px">
            I understand
          </TEXT.secondary>
        </Flex>

        <Button
          disabled={!confirmed}
          altDisabledStyle={true}
          onClick={() => {
            tokens.map((token) => addToken(token));
            handleCurrencySelect && handleCurrencySelect(tokens[0]);
          }}
          className=".token-dismiss-button"
        >
          Confirm
        </Button>
      </AutoColumn>
    </Wrapper>
  );
}
