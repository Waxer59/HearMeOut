import { Avatar, Heading } from '@radix-ui/themes';
import Draggable from 'react-draggable';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  isMuted?: boolean;
  name: string;
  avatar?: string;
}

export const CallLayout: React.FC<Props> = ({
  children,
  name,
  avatar,
  isMuted
}) => {
  const draggableCallRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable bounds="parent" nodeRef={draggableCallRef}>
      <div
        ref={draggableCallRef}
        className="absolute bg-secondary p-4 rounded-lg flex items-center flex-col gap-4 cursor-move right-10 top-10 z-10">
        <Avatar
          fallback={getFallbackAvatarName(name)}
          src={avatar}
          size="7"
          className={`${isMuted ? 'animate-pulse' : ''}`}
        />
        <Heading as="h2" className="capitalize">
          {name}
        </Heading>
        {children}
      </div>
    </Draggable>
  );
};
