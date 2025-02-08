import React from 'react';
import Modal from '../../components/Modal';
import { ApproveTokensContent, TransactionErrorContent } from '../../components/TransactionConfirmationModal';

interface ErrorModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

interface ApproveTokensProps extends ErrorModalProps {
  pendingText: string;
}

export function TransactionErrorModal({ isOpen, onDismiss }: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={345}>
      <TransactionErrorContent onDismiss={onDismiss} />
    </Modal>
  );
}

export function UserBlockedModal({ isOpen, onDismiss }: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={345}>
      <TransactionErrorContent onDismiss={onDismiss} message="Your wallet is blocked." buttonText="Close" />
    </Modal>
  );
}

export function ApproveTokensModal({ isOpen, onDismiss, pendingText }: ApproveTokensProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={345}>
      <ApproveTokensContent onDismiss={onDismiss} pendingText={pendingText} />
    </Modal>
  );
}
