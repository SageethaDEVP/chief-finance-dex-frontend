import React from 'react';
import { Token } from '@bidelity/sdk';
import { RowFixed } from '../../Row';
import CurrencyLogo from '../../CurrencyLogo';
import { TEXT } from '../../../theme';
import { ButtonPrimary } from '../../Button';
import styled from 'styled-components';
import { useIsUserAddedToken, useIsTokenActive } from '../../../hooks/Tokens';
import { CheckCircle } from 'react-feather';
import { AutoColumn } from '../../Column';

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.green1};
`;

const Button = styled(ButtonPrimary)`
  width: 100%;
  padding-top: 9px;
  padding-bottom: 9px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
`;

export default function ImportRow({
  token,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  return (
    <AutoColumn gap="xl">
      <InfoRow>
        <CurrencyLogo currency={token} size={'24px'} style={{ opacity: dim ? '0.6' : '1' }} />
        <TEXT.primary fontSize={12} fontWeight={600} marginLeft="6px">
          {token.symbol}
        </TEXT.primary>
        <TEXT.secondary fontSize={12} fontWeight={600} marginLeft="6px">
          {token.name}
        </TEXT.secondary>
      </InfoRow>
      <div>
        {!isActive && !isAdded ? (
          <Button
            onClick={() => {
              setImportToken && setImportToken(token);
              showImportView();
            }}
          >
            Confirm
          </Button>
        ) : (
          <RowFixed style={{ minWidth: 'fit-content' }}>
            <CheckIcon />
            <TEXT.default color="primary1">Active</TEXT.default>
          </RowFixed>
        )}
      </div>
    </AutoColumn>
  );
}
