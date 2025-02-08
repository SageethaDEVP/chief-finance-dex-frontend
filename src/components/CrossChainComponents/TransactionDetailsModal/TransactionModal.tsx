import React, { useEffect, useState } from 'react';
import useLast from '../../../hooks/useLast';
import Modal from '../../Modal';
import { TransactionData } from './TransactionData';

export enum TransactionView {
  search,
}

interface TransactionModalProps {
  isOpen: boolean;
  onDismiss: (bool: boolean) => void;
}

export default function TransactionModal({ isOpen, onDismiss }: TransactionModalProps) {
  const [modalView, setModalView] = useState(TransactionView);
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(TransactionView);
    }
  }, [isOpen, lastOpen]);

  // change min height if not searching
  // const minHeight = modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList ? 40 : 60;

  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss(false)} maxHeight={80} maxWidth={345}>
      <TransactionData isOpen={isOpen} onDismiss={onDismiss} />
    </Modal>
  );
}
