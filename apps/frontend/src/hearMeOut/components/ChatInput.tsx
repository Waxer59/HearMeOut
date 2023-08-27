import { IconButton, TextField, Tooltip } from '@radix-ui/themes';
import { IconMoodSmile, IconSend } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import type { EmojiProps, InputEvent } from '../../types/types';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export const ChatInput = () => {
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const onEmojiPickerClick = () => {
    setIsEmojiMenuOpen(!isEmojiMenuOpen);
  };

  const onEmojiClick = (emojiData: EmojiProps) => {
    console.log(emojiData);
    const inputElement = messageInputRef.current;

    const startPos = inputElement?.selectionStart ?? 0;
    const endPos = inputElement?.selectionEnd ?? 0;

    const newValue =
      message.substring(0, startPos) +
      emojiData.native +
      message.substring(endPos, message.length);

    setMessage(newValue);
    messageInputRef.current?.focus();
    messageInputRef.current?.setSelectionRange(startPos, startPos);
  };

  const onMessageInputChange = (e: InputEvent) => {
    setMessage(e.target.value);
  };

  return (
    <div className="px-20 pb-8 pt-8 relative">
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
    </div>
  );
};
