import {
  Avatar,
  ContextMenu,
  Button,
  DropdownMenu,
  TextFieldInput
} from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { IconChevronDown } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessageMenu } from './';
import { useSocketChatEvents } from '../hooks/useSocketChatEvents';
import { toast } from 'sonner';

interface Props {
  id: string;
  senderId: string;
  isEdited: boolean;
  name: string;
  avatar?: string;
  content: string;
  date: Date;
}

export const ChatMessage: React.FC<Props> = ({
  id,
  senderId,
  isEdited,
  content,
  date,
  name,
  avatar
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(content);
  const { sendUpdateMessage } = useSocketChatEvents();
  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleOnKeyDownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancelEditMessage();
      }
      if (e.key === 'Enter') {
        handleSaveEditMessage();
      }
    };

    document.addEventListener('keydown', handleOnKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleOnKeyDownEvent);
    };
  }, [isEditing]);

  const handleEditMessage = () => {
    editInput.current?.focus();
    setIsEditing(true);
  };

  const handleSaveEditMessage = () => {
    const newMessage = editInput.current?.value;

    if (!newMessage) {
      toast.error('You have to provide a text to edit the message');
      return;
    }

    sendUpdateMessage(id, newMessage);
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleCancelEditMessage = () => {
    setIsEditing(false);
  };

  return (
    <DropdownMenu.Root onOpenChange={setIsMenuOpen}>
      <ContextMenu.Root onOpenChange={setIsMenuOpen}>
        <ContextMenu.Trigger>
          <div
            className={`flex items-center gap-5 text-lg transition rounded pl-2 w-full hover:bg-secondary hover:shadow ${
              (isMenuOpen || isEditing) && 'bg-secondary shadow'
            }`}>
            <div className="self-start pt-[10px]">
              <Avatar
                fallback={getFallbackAvatarName(name)}
                src={avatar}
                size="3"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full opacity-60">
                <div className="flex items-center gap-3">
                  <span className="font-bold capitalize">{name}</span>
                  <span className="lowecase">{date.toDateString()}</span>
                  {isEdited && (
                    <span className="text-sm opacity-70">(edited)</span>
                  )}
                </div>
                <div className="pt-2 pr-2">
                  <DropdownMenu.Trigger>
                    <Button size="1" className="cursor-pointer bg-iris">
                      <IconChevronDown size={18} />
                    </Button>
                  </DropdownMenu.Trigger>
                </div>
              </div>
              {isEditing ? (
                <div className="flex flex-col gap-4 max-w-[95%] my-2">
                  <TextFieldInput
                    placeholder={content}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    ref={editInput}
                  />
                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={handleCancelEditMessage}
                      variant="soft"
                      color="red">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEditMessage} color="green">
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="pr-16 pb-2 break-all">{content}</p>
              )}
            </div>
          </div>
        </ContextMenu.Trigger>
        <ChatMessageMenu
          type={ContextMenu}
          id={id}
          senderId={senderId}
          handleEditMessage={handleEditMessage}
        />
        <ChatMessageMenu
          type={DropdownMenu}
          id={id}
          senderId={senderId}
          handleEditMessage={handleEditMessage}
        />
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
};
