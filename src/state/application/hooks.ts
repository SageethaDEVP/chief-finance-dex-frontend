import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveWeb3React } from '../../hooks';
import { AppDispatch, AppState } from '../index';
import { addPopup, ApplicationModal, PopupContent, removePopup, setOpenModal } from './actions';

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();
  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1]);
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal);
  return openModal === modal;
}

export function useLanguage(): 'en' | 'ru' {
  return useSelector((state: AppState) => state.localization.language);
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open]);
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch]);
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}
export function useSuccessModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SUCCESS);
}

export function useSuccessModalOpen(): boolean {
  return useModalOpen(ApplicationModal.SUCCESS);
}
export function useUserBlockedModalToggle(): () => void {
  return useToggleModal(ApplicationModal.USER_BLOCKED);
}

export function useUserBlockedModalOpen(): boolean {
  return useModalOpen(ApplicationModal.USER_BLOCKED);
}
export function useErrorModalOpen(): boolean {
  return useModalOpen(ApplicationModal.TRANSACTION_ERROR);
}
export function useErrorModalToggle(): () => void {
  return useToggleModal(ApplicationModal.TRANSACTION_ERROR);
}

export function useTokenAddedModalOpen(): boolean {
  return useModalOpen(ApplicationModal.ADDED_TOKEN);
}
export function useTokenAddedModalToggle(): () => void {
  return useToggleModal(ApplicationModal.ADDED_TOKEN);
}

export function useApproveTokensModalOpen(): boolean {
  return useModalOpen(ApplicationModal.APPROVE_TOKENS);
}
export function useApproveTokensModalToggle(): () => void {
  return useToggleModal(ApplicationModal.APPROVE_TOKENS);
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS);
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP);
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP);
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM);
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE);
}

export function useToggleVoteModal(): () => void {
  return useToggleModal(ApplicationModal.VOTE);
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch]
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
