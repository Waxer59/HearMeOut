import { IconArrowBackUp, IconEdit, IconTrash } from '@tabler/icons-react';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import { useAccountStore, useChatStore } from '../../store';
import type { MessageDetails } from '../../store/types/types';

interface Props {
  message: MessageDetails;
  handleEditMessage: () => void;
  type: any;
}

export const ChatMessageMenu: React.FC<Props> = ({
  type,
  message,
  handleEditMessage,
  ...props
}) => {
  const { id, fromId } = message;
  const MenuType = type;
  const { sendDeleteMessage } = useSocketChatEvents();
  const userId = useAccountStore((state) => state.account?.id);
  const setReplyMessage = useChatStore((state) => state.setReplyMessage);

  const isOwnMessage = userId === fromId;

  const handleDeleteMessage = () => {
    sendDeleteMessage(id);
  };

  const handleReplyMessage = () => {
    setReplyMessage(message);
  };

  return (
    <MenuType.Content {...props}>
      <MenuType.Item
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleReplyMessage}>
        Reply <IconArrowBackUp size={18} />
      </MenuType.Item>
      {isOwnMessage && (
        <>
          <MenuType.Item
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleEditMessage}>
            Edit <IconEdit size={18} />
          </MenuType.Item>
          <MenuType.Separator />
          <MenuType.Item
            color="red"
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleDeleteMessage}>
            Delete <IconTrash size={18} />
          </MenuType.Item>
        </>
      )}
    </MenuType.Content>
  );
};
