import { Token } from '@bidelity/sdk';
import React from 'react';
import Modal from '../Modal';
import { ImportToken } from 'components/SearchModal/ImportToken';

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
  onDismiss,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} maxWidth={345}>
      <ImportToken onDismiss={onDismiss} tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
}
