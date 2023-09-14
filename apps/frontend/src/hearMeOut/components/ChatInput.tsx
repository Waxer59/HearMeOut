import { IconButton, TextField, Tooltip } from '@radix-ui/themes';
import { IconMoodSmile, IconSend } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import type { EmojiProps, InputEvent } from '../../types/types';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { TypingMessage } from './';

export const ChatInput = () => {
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const selectionStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectionStartRef.current !== null && messageInputRef.current) {
      messageInputRef.current.focus();
      messageInputRef.current.setSelectionRange(
        selectionStartRef.current,
        selectionStartRef.current
      );
    }
  }, [message]);

  const onEmojiPickerClick = () => {
    setIsEmojiMenuOpen(!isEmojiMenuOpen);
  };

  const onEmojiClick = (emojiData: EmojiProps) => {
    const inputElement = messageInputRef.current;

    const startPos = inputElement?.selectionStart ?? 0;
    const endPos = inputElement?.selectionEnd ?? 0;

    const newValue =
      message.substring(0, startPos) +
      emojiData.native +
      message.substring(endPos, message.length);

    setMessage(newValue);

    selectionStartRef.current = startPos + emojiData.native.length;
  };

  const onMessageInputChange = (e: InputEvent) => {
    setMessage(e.target.value);

    if (messageInputRef.current) {
      selectionStartRef.current = messageInputRef.current.selectionStart;
    }
  };

  return (
    <div className="px-20 pb-12 pt-8 relative flex flex-col">
      <div
        className={`absolute bottom-24 right-20 ${
          isEmojiMenuOpen ? 'block' : 'hidden'
        }`}>
        <Picker data={data} onEmojiSelect={onEmojiClick} />
      </div>
      <TextField.Root className="py-1" variant="soft" color="gray">
        <TextField.Input
          placeholder="Type a message here"
          size="3"
          onChange={onMessageInputChange}
          ref={messageInputRef}
          value={message}
        />
        <TextField.Slot>
          <Tooltip content="Add emoji">
            <IconButton
              size="2"
              variant="ghost"
              color="indigo"
              onClick={onEmojiPickerClick}>
              <IconMoodSmile />
            </IconButton>
          </Tooltip>
        </TextField.Slot>
        <TextField.Slot pr="2">
          <Tooltip content="Send message">
            <IconButton size="2" variant="solid" color="indigo">
              <IconSend />
            </IconButton>
          </Tooltip>
        </TextField.Slot>
      </TextField.Root>
      <TypingMessage usernames={['Waxer59']} />
    </div>
  );
};
