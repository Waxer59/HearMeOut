import { useAccountStore, useChatStore, useUiStore } from '../../store';

export const useClearState = () => {
  const clearAccountState = useAccountStore((state) => state.clearAccountState);
  const clearChatState = useChatStore((state) => state.clearChatState);
  const clearUiState = useUiStore((state) => state.clearUiState);

  return () => {
    clearAccountState();
    clearChatState();
    clearUiState();
  };
};
