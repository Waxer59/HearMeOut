import { IconButton, TextField, Tooltip, Button } from '@radix-ui/themes';
import { IconMoodSmile, IconSend, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import type { EmojiProps, InputEvent } from '@/types/types';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { TYPING_TIMEOUT } from '@constants';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';
import Draggable from 'react-draggable';
import { useAccountStore } from '@store/account';
import { useChatStore } from '@store/chat';
import { TypingIndicator } from '@hearmeout/components/chat/TypingIndicator';

export const Input: React.FC = () => {
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const { sendMessage, sendTyping, sendTypingOff } = useSocketChatEvents();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const selectionStartRef = useRef<number | null>(null);
  const draggableEmojisRef = useRef<HTMLDivElement>(null);
  const settings = useAccountStore((state) => state.settings);
  const replyMessage = useChatStore((state) => state.replyMessage);
  const usersTyping = useChatStore((state) => state.usersTyping);
  const clearReplyMessage = useChatStore((state) => state.clearReplyMessage);

  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
      if (e.key === 'Escape') {
        setIsEmojiMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDownEvent);
    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, []);

  useEffect(() => {
    if (!message) {
      sendTypingOff();
      return;
    }

    if (isTyping) {
      sendTyping();
    } else {
      sendTypingOff();
    }
  }, [isTyping]);

  useEffect(() => {
    if (selectionStartRef.current !== null && messageInputRef.current) {
      messageInputRef.current.focus();
      messageInputRef.current.setSelectionRange(
        selectionStartRef.current,
        selectionStartRef.current
      );
    }

    const timeoutId = setTimeout(() => setIsTyping(false), TYPING_TIMEOUT);
    return () => clearTimeout(timeoutId);
  }, [message]);

  const onEmojiPickerClick = () => {
    setIsEmojiMenuOpen(!isEmojiMenuOpen);
  };

  const onEmojiClick = (emojiData: EmojiProps) => {
    const inputElement = messageInputRef.current;

    const startPos = inputElement?.selectionStart ?? 0;
    const endPos = inputElement?.selectionEnd ?? 0;

    setIsTyping(true);

    const newValue =
      message.substring(0, startPos) +
      emojiData.native +
      message.substring(endPos, message.length);

    setMessage(newValue);

    selectionStartRef.current = startPos + emojiData.native.length;
  };

  const handleRemoveReply = () => {
    clearReplyMessage();
  };

  const onMessageInputChange = (e: InputEvent) => {
    setMessage(e.target.value);
    setIsTyping(true);

    if (messageInputRef.current) {
      selectionStartRef.current = messageInputRef.current.selectionStart;
    }
  };

  const handleSendMessage = () => {
    sendMessage(message, replyMessage?.id);
    setIsTyping(false);
    setMessage('');
    clearReplyMessage();
    messageInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col px-10 md:px-20 pt-10">
      {replyMessage && (
        <div className="flex justify-between bg-secondary p-4 rounded-t-lg gap-2 text-md">
          <h3>
            Reply to <strong>{replyMessage.from.username}</strong>{' '}
          </h3>
          <Button
            size="2"
            variant="ghost"
            color="red"
            onClick={handleRemoveReply}>
            <IconX />
          </Button>
        </div>
      )}
      <div className="pb-12 relative flex flex-col">
        <Draggable axis="x" bounds="parent" nodeRef={draggableEmojisRef}>
          <div
            ref={draggableEmojisRef}
            className={`absolute bottom-28 right-20 cursor-move select-none ${
              isEmojiMenuOpen ? 'block' : 'hidden'
            }`}>
            <Picker
              data={data}
              onEmojiSelect={onEmojiClick}
              theme={settings.theme}
              previewPosition="none"
            />
          </div>
        </Draggable>
        <TextField.Root className="py-1" variant="soft" color="gray">
          <TextField.Input
            placeholder="Type a message here"
            size="3"
            onChange={onMessageInputChange}
            ref={messageInputRef}
            value={message}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            autoFocus
          />
          <TextField.Slot>
            <Tooltip content="Add emoji">
              <IconButton
                size="2"
                variant="ghost"
                className="transition hidden sm:block"
                color="indigo"
                onClick={onEmojiPickerClick}>
                <IconMoodSmile />
              </IconButton>
            </Tooltip>
          </TextField.Slot>
          <TextField.Slot pr="2">
            <Tooltip content="Send message">
              <IconButton
                size="2"
                variant="solid"
                color="indigo"
                className="transition"
                onClick={handleSendMessage}>
                <IconSend />
              </IconButton>
            </Tooltip>
          </TextField.Slot>
        </TextField.Root>
        <TypingIndicator usersTyping={usersTyping} />
      </div>
    </div>
  );
};
