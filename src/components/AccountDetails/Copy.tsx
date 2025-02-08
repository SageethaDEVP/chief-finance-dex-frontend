import React from 'react';
import styled from 'styled-components';
import useCopyClipboard from '../../hooks/useCopyClipboard';

import { LinkStyledButton } from '../../theme';
import { Copy } from 'react-feather';

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`;
const TransactionStatusText = styled.span`
  position: relative;
  margin-left: 0.25rem;
  font-size: 12px;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  height: 16px;
`;

const CopyText = styled(TransactionStatusText)`
  position: absolute;
  bottom: -4px;
  right: -6px;
`;

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>Copied</TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <Copy size={'16'} />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  );
}
