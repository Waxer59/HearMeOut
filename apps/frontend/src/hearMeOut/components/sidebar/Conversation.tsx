import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { removeActiveConversation as removeActiveConversationAPI } from '@services//hearMeOutAPI';
import { ConversationTypes } from '@store/types/types';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';
import { NotificationIndicator } from '@hearmeout/components/NotificationIndicator';
import { useEffect, useState } from 'react';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';

interface Props {
  id: string;
  name: string;
  imageURL?: string;
  isOnline: boolean;
  type: ConversationTypes;
}

const REMOVE_MESSAGE = {
  [ConversationTypes.chat]: 'Remove contact',
  [ConversationTypes.group]: 'Exit group'
};

const CLOSE_MESSAGE = {
  [ConversationTypes.chat]: 'Close chat',
  [ConversationTypes.group]: 'Close group'
};

export const Conversation: React.FC<Props> = ({
  id,
  name,
  imageURL,
  isOnline,
  type
}) => {
  const account = useAccountStore((state) => state.account)!;
  const [hasNewMessages, setHasNewMessages] = useState(
    account.conversationNotificationIds.includes(id)
  );
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const isInActiveConversationsTab = useUiStore(
    (state) => state.isInActiveConversationsTab
  );
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const removeActiveConversation = useChatStore(
    (state) => state.removeActiveConversation
  );
  const removeConversation = useChatStore((state) => state.removeConversation);
  const { sendRemoveConversation, sendExitGroup } = useSocketChatEvents();

  useEffect(() => {
    setHasNewMessages(account.conversationNotificationIds.includes(id));
  }, [account.conversationNotificationIds]);

  const handleOpenChat = async () => {
    setCurrentConversationId(id);
    setHasNewMessages(false);
  };

  const handleCloseChat = async () => {
    await removeActiveConversationAPI(id);
    removeActiveConversation(id);
  };

  const handleExitConversation = async () => {
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }

    switch (type) {
      case ConversationTypes.group:
        sendExitGroup(id);
        setShowGroupSettings(false);
        break;
      case ConversationTypes.chat:
        sendRemoveConversation(id);
        break;
    }
    removeConversation(id);
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button
          variant="ghost"
          radius="large"
          className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition cursor-pointer relative"
          onClick={handleOpenChat}>
          <Avatar fallback={getFallbackAvatarName(name)} src={imageURL} />
          <span className="max-w-[14ch] truncate">{name}</span>
          {type === ConversationTypes.chat &&
            (isOnline ? (
              <Badge color="green" className="ml-auto">
                online
              </Badge>
            ) : (
              <Badge color="gray" className="ml-auto">
                offline
              </Badge>
            ))}
          {hasNewMessages && <NotificationIndicator />}
        </Button>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {isInActiveConversationsTab && (
          <>
            <ContextMenu.Item
              className="cursor-pointer"
              onClick={handleCloseChat}>
              {CLOSE_MESSAGE[type]}
            </ContextMenu.Item>

            <ContextMenu.Separator />
          </>
        )}

        <ContextMenu.Item
          color="red"
          className="cursor-pointer"
          onClick={handleExitConversation}>
          {REMOVE_MESSAGE[type]}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
