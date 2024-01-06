import { Avatar, Badge, Button, ContextMenu } from '@radix-ui/themes';
import { getFallbackAvatarName, capitalize } from '../../helpers';
import { useAccountStore, useChatStore } from '../../../store';
import { closeActiveConversation } from '../../../services/hearMeOutAPI';
import { ConversationTypes } from '../../../store/types/types';
import { useSocketChatEvents } from '../../hooks/useSocketChatEvents';
import { NotificationIndicator } from '../NotificationIndicator';
import { useState } from 'react';

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
  const {
    setCurrentConversationId,
    removeActiveConversation,
    conversations,
    removeConversation,
    currentConversationId,
    activeConversations,
    setShowGroupSettings
  } = useChatStore((state: any) => state);
  const account = useAccountStore((state) => state.account);
  const { sendRemoveConversation, sendExitGroup } = useSocketChatEvents();
  const [hasNewMessages, setHasNewMessages] = useState(
    conversations
      .find((conversation: any) => conversation.id === id)
      ?.messages?.some(
        (message: any) => !message.viewedByIds.includes(account!.id)
      )
  );
  const isActive = activeConversations.includes(id);

  const handleOpenChat = async () => {
    setCurrentConversationId(id);
    document.title = `${capitalize(name)} | HearMeOut`;
    setHasNewMessages(false);
  };

  const handleCloseChat = async () => {
    await closeActiveConversation(id);
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
          {name}
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
        {isActive && (
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
