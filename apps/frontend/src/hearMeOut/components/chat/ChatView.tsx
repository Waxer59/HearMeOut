import { IconMenu2 } from '@tabler/icons-react';
import { Messages, Input, Title } from '.';
import { useChatStore, useUiStore } from '../../../store';
import { NotFoundIcon } from '../Icons';
import { Button } from '@radix-ui/themes';

export const ChatView: React.FC = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen);

  const toggleShowSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {currentConversationId ? (
        <div className="flex flex-col flex-1 justify-between h-screen">
          <Title />
          <Messages />
          <Input />
        </div>
      ) : (
        <div className="flex justify-center flex-1 items-center flex-col">
          <div className="md:hidden flex w-full px-10 md:px-20 pt-5 py-4 shadow-[0px_4px_4px_0px_#00000040] uppercase">
            <Button
              variant="ghost"
              className="cursor-pointer md:hidden"
              onClick={toggleShowSidebar}>
              <IconMenu2 />
            </Button>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center md:gap-32 h-screen">
            <h2 className="text-2xl font-bold hidden md:block">
              Start chatting!
            </h2>
            <NotFoundIcon className="w-full" />
          </div>
        </div>
      )}
    </>
  );
};
