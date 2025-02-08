import React, { useEffect, useState } from 'react';
import useLast from '../../../hooks/useLast';
import Modal from '../../Modal';
import { ChainSearch } from './ChainSearch';
import { Chain } from '../CCHooks/types';


export enum ChainModalView {
  search,

  // manage,
}

interface ChainSearchModalProps {
  isOpen: boolean;
  onDismiss: (bool: boolean) => void;
  selectedChain: Chain;
  otherSelectedChain: Chain;
  setChain: (chainId: Chain) => void;
}

export default function ChainSelectModal({
  isOpen,
  onDismiss,
  selectedChain,
  otherSelectedChain,
  setChain,
}: ChainSearchModalProps) {
  const [modalView, setModalView] = useState(ChainModalView);
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(ChainModalView);
    }
  }, [isOpen, lastOpen]);

  // change min height if not searching
  // const minHeight = modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList ? 40 : 60;

  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss(false)} maxHeight={80} maxWidth={345}>
      <ChainSearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        selectedChain={selectedChain}
        otherSelectedChain={otherSelectedChain}
        setChain={setChain}
      />
    </Modal>
  );
}
