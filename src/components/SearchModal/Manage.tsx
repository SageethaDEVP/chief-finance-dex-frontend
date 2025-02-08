import React, { useState } from 'react';
import { RowBetween } from 'components/Row';
import { Text } from 'rebass';
import styled from 'styled-components';
import { Token } from '@bidelity/sdk';
import { TokenList } from '@uniswap/token-lists';
import { CurrencyModalView } from './CurrencySearchModal';
import CloseIcon from '../../assets/svg-bid/close-small.svg';
import ArrowLeftIcon from '../../assets/svg-bid/arrow-left-grey.svg';
import PlusIcon from '../../assets/svg-bid/plus.svg';
import { ButtonPrimary } from '../Button';
import { AutoColumn } from '../Column';
import { TEXT } from '../../theme';
import ManageTokens from './ManageTokens';
import Gs from 'theme/globalStyles';
import leftArrow from '../../assets/images/leftArrow.png';
import cross from '../../assets/images/cross.png';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 16px;
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

const Button = styled(ButtonPrimary)`
  padding-top: 9px;
  padding-bottom: 9px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
`;

export default function Manage({
  onDismiss,
  setModalView,
  setImportToken,
}: {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  
  const [showAddToken, setShowAddToken] = useState(false);

  return (
    <Gs.PopupMain>
      <Gs.OverLay />
      <Gs.Popup>
        <h3>
          <a onClick={() => setModalView(CurrencyModalView.search)} className="arrow">
            <img width={20} src={leftArrow} alt="back" />
          </a>
          Manage
          <a onClick={onDismiss} className="close">
            <img width={12} src={cross} alt="cross" />
          </a>
        </h3>
        {!showAddToken && (
          <Gs.BtnSm className="lg" onClick={() => setShowAddToken(true)}>
            + &nbsp; Add Your Token
          </Gs.BtnSm>
        )}
        {showAddToken && <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />}
      </Gs.Popup>
    </Gs.PopupMain>
  );
}
