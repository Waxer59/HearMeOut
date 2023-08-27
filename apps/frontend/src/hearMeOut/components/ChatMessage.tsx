import { Avatar, ContextMenu, Button, DropdownMenu } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../helpers/getFallbackAvatarName';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import { ChatMessageMenu } from './';

interface Props {
  name: string;
  avatar: string;
  content: string;
  date: Date;
}

export const ChatMessage = ({ content, date, name, avatar }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DropdownMenu.Root onOpenChange={setIsMenuOpen}>
      <ContextMenu.Root onOpenChange={setIsMenuOpen}>
        <ContextMenu.Trigger>
          <div
            className={`flex items-center gap-5 text-lg transition rounded pl-2 w-full hover:bg-tertiary ${
              isMenuOpen && 'bg-tertiary'
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
                </div>
                <div className="pt-2 pr-2">
                  <DropdownMenu.Trigger>
                    <Button size="1" variant="solid">
                      <IconChevronDown size={18} />
                    </Button>
                  </DropdownMenu.Trigger>
                </div>
              </div>
              <p className="max-w-4xl pb-2">{content}</p>
            </div>
          </div>
        </ContextMenu.Trigger>
        <ChatMessageMenu type={ContextMenu} />
        <ChatMessageMenu type={DropdownMenu} />
      </ContextMenu.Root>
    </DropdownMenu.Root>
  );
};
