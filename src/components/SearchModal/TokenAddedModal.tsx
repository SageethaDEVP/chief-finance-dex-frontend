import Modal from '../Modal';
import React from 'react';
import { TokenAddedModalContent } from '../TransactionConfirmationModal';
import CircleIcon from '../../assets/svg-bid/tick-circle.svg';
import ErrorIcon from '../../assets/svg-bid/error.svg';

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

export function TokenAddedModal({ isOpen, onDismiss }: Props) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={345}>
      <TokenAddedModalContent
        onDismiss={onDismiss}
        icon={CircleIcon}
        text={'Your token was added'}
        title={'Token added'}
      />
    </Modal>
  );
}

export function TokenNotAddedModal({ isOpen, onDismiss }: Props) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={345}>
      <TokenAddedModalContent
        onDismiss={onDismiss}
        icon={ErrorIcon}
        text={"Token doesn't exist in current network"}
        title={'Token not added'}
      />
    </Modal>
  );
}
