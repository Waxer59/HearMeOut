import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';

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
