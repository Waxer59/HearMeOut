import { IconArrowBackUp, IconEdit, IconTrash } from '@tabler/icons-react';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import { useAccountStore } from '../../store';

interface Props {
  id: string;
  senderId: string;
  handleEditMessage: () => void;
  type: any;
}

export const ChatMessageMenu: React.FC<Props> = ({
  type,
  id,
  senderId,
  handleEditMessage,
  ...props
}) => {
  const MenuType = type;
  const { sendDeleteMessage } = useSocketChatEvents();
  const userId = useAccountStore((state) => state.account?.id);

  const isOwnMessage = userId === senderId;

  const handleDeleteMessage = () => {
    sendDeleteMessage(id);
  };

  return (
    <MenuType.Content {...props}>
      <MenuType.Item className="flex items-center gap-2 cursor-pointer">
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
