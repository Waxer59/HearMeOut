import {
  Avatar,
  ContextMenu,
  Button,
  DropdownMenu,
  TextFieldInput
} from '@radix-ui/themes';
import { IconChevronDown } from '@tabler/icons-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';
import { toast } from 'sonner';
import type { MessageDetails } from '@store/types/types';
import { useChatStore } from '@store/chat';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';
import { MessageMenu } from '@hearmeout/components/chat/MessageMenu';

interface Props {
  message: MessageDetails;
  date: Date;
  name: string;
  avatar?: string;
}

export const Message: React.FC<Props> = ({ message, name, avatar, date }) => {
  const { id, isEdited, content } = message;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(content);
  const editInput = useRef<HTMLInputElement>(null);
  const { sendUpdateMessage } = useSocketChatEvents();
  const conversations = useChatStore((state) => state.conversations);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const replyMsg = conversations
    .find((e) => e.id === currentConversationId)!
    .messages.find((e) => e.id === message.replyId);
  const isReplying = Boolean(replyMsg);

  const handleEditMessage = () => {
    editInput.current?.focus();
    setIsEditing(true);
  };

  const handleSaveEditMessage = useCallback(() => {
    const newMessage = editInput.current?.value;

    if (!newMessage) {
      toast.error('You have to provide a text to edit the message');
      return;
    }

    sendUpdateMessage(id, newMessage);
    setIsEditing(false);
    setIsMenuOpen(false);
  }, [id, sendUpdateMessage]);

  const handleCancelEditMessage = () => {
    setIsEditing(false);
  };

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
  }, [handleSaveEditMessage, isEditing]);

  return (
    <DropdownMenu.Root onOpenChange={setIsMenuOpen}>
      <ContextMenu.Root onOpenChange={setIsMenuOpen}>
        <ContextMenu.Trigger>
          <div
            className={`flex items-center gap-2 text-lg transition rounded pl-2 w-full hover:bg-secondary hover:shadow ${
              (isMenuOpen || isEditing) && 'bg-secondary shadow'
            } ${isReplying ? 'flex-col' : ''}`}>
            {isReplying && (
              <div className="justify-start w-full pt-2 border-gray-700 flex items-center gap-2 pl-[60px] before:content-[''] before:absolute before:border-t-2 before:border-l-2 before:border-gray-500 before:w-10 before:h-6 before:rounded-tl before:left-4 before:-bottom-2 relative">
                <Avatar
                  fallback={getFallbackAvatarName(
                    replyMsg?.from.username ?? ''
                  )}
                  src={replyMsg?.from.avatar}
                  size="1"
                />
                <span className="font-bold capitalize opacity-70">
                  {replyMsg?.from.username}
                </span>
                <p className="opacity-70">{replyMsg?.content}</p>
              </div>
            )}
            <div className="flex items-center gap-5 w-full">
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
                    <span className="hidden md:block">
                      {date.toDateString()}
                    </span>
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
          </div>
        </ContextMenu.Trigger>
        <MessageMenu
          type={ContextMenu}
          message={message}
          handleEditMessage={handleEditMessage}
        />
        <MessageMenu
          type={DropdownMenu}
          message={message}
          handleEditMessage={handleEditMessage}
        />
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
};
