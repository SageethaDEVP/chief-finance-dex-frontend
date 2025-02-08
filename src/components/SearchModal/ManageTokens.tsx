import React, { useRef, RefObject, useCallback, useState } from 'react';
import { TEXT } from 'theme';
import { useToken } from 'hooks/Tokens';
import styled from 'styled-components';
import { Token } from '@bidelity/sdk';
import { isAddress } from 'utils';
import ImportRow from './ImportRow';
import { CurrencyModalView } from './CurrencySearchModal';

const AddTokenSection = styled.div`
  margin-top: 8px;
  border-radius: 14px;
  padding: 8px 6px;
  background-color: ${({ theme }) => theme.newTheme.bg2};
`;

const AddTokenInputSection = styled.div`
  border-radius: 10px;
  padding: 20px 12px;
  background-color: ${({ theme }) => theme.newTheme.white};
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.newTheme.blue};
  font-size: 12px;
  font-weight: 600;
  padding: 2px 0;
`;

const SpacingTop = styled.div`
  margin-top: 8px;
`;

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);
  return (
    <TextBox>
      <label>Add your token address</label>
      <input
        type="text"
        name="address"
        id="token-search-input"
        placeholder={'0x0000'}
        value={searchQuery}
        autoComplete="off"
        ref={inputRef as RefObject<HTMLInputElement>}
        onChange={handleInput}
      />
      {searchQuery !== '' && !isAddressSearch && (
        <TEXT.default fontSize={13} fontWeight={600} color="error">
          Enter valid token address
        </TEXT.default>
      )}
      {searchToken && (
        <SpacingTop>
          <ImportRow
            token={searchToken}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
          />
        </SpacingTop>
      )}
    </TextBox>
  );
}

const TextBox = styled.div`
  display: flex;
  flex-flow: column;
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
  }
`;
