import { Badge, Button, Heading, Tooltip } from '@radix-ui/themes';
import { IconMenu2, IconPhone, IconUsersGroup } from '@tabler/icons-react';
import { ConversationTypes } from '@store/types/types';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { CALLING_TONES, CALLING_TONES_TIME_INTERVAL } from '@constants';
import { useAudio } from '@hearmeout/hooks/useAudio';
import { useCallStore } from '@store/call';
import { useEffect, useRef } from 'react';

interface Props {
  name: string;
  isOnline: boolean;
  conversationType: ConversationTypes;
}

export const Title: React.FC<Props> = ({
  name,
  isOnline,
  conversationType
}) => {
  const setShowGroupSettings = useUiStore(
    (state) => state.setShowGroupSettings
  );
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const { playAudio, stopAudio } = useAudio({ data: '/sounds/calling.mp3' });
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen);
  const setCallingId = useCallStore((state) => state.setCallingId);
  const isCalling = useCallStore((state) => state.isCalling);
  const callIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isCalling) {
      stopAudio();
      clearInterval(callIntervalRef.current!);
    }
  }, [isCalling]);

  const emitCallingSound = () => {
    let currentCallingTones = 0;

    playAudio();

    callIntervalRef.current = setInterval(() => {
      if (CALLING_TONES === currentCallingTones) {
        clearInterval(callIntervalRef.current!);
        callIntervalRef.current = null;
        return;
      }

      currentCallingTones++;
      playAudio();
    }, CALLING_TONES_TIME_INTERVAL);
  };

  const handleCall = () => {
    if (!currentConversationId) {
      return;
    }

    emitCallingSound();
    setCallingId(currentConversationId);
  };

  const handleShowGroupSettings = () => {
    setShowGroupSettings(true);
  };

  const toggleShowSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex justify-between items-center px-10 md:px-20 pt-5 py-4 shadow-[0px_4px_4px_0px_#00000040] uppercase">
      <div className="flex items-center justify-between gap-5">
        <Button
          variant="ghost"
          className="cursor-pointer md:hidden"
          onClick={toggleShowSidebar}>
          <IconMenu2 />
        </Button>
        <Heading as="h2" weight="bold" className="text-lg">
          {name}
        </Heading>
      </div>
      <div className="flex items-center gap-5">
        {conversationType === ConversationTypes.chat &&
          (isOnline ? (
            <Badge color="green">online</Badge>
          ) : (
            <Badge color="gray">offline</Badge>
          ))}
        {conversationType === ConversationTypes.group && (
          <Tooltip content="Members">
            <Button
              variant="ghost"
              className="transition cursor-pointer"
              onClick={handleShowGroupSettings}>
              <IconUsersGroup />
            </Button>
          </Tooltip>
        )}
        <Button className="cursor-pointer" variant="ghost" onClick={handleCall}>
          <IconPhone />
        </Button>
      </div>
    </div>
  );
};
