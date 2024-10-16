import { IconMenu2 } from '@tabler/icons-react';
import { NotFoundIcon } from '@hearmeout/components/Icons';
import { Button } from '@radix-ui/themes';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { Input } from '@hearmeout/components/chat/Input';
import { Messages } from '@hearmeout/components/chat/Messages';
import { Title } from '@hearmeout/components/chat/Title';
import { getConversationName } from '@/hearMeOut/helpers/getConversationName';
import { getConversationIsOnline } from '@/hearMeOut/helpers/getConversationIsOnline';

export const ChatView: React.FC = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const conversations = useChatStore((state) => state.conversations);
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
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
          <Title
            name={getConversationName(currentConversation!)}
            conversationType={currentConversation!.type}
            isOnline={getConversationIsOnline(currentConversation!)}
          />
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
          <div className="flex flex-col flex-1 justify-center items-center gap-20 h-screen">
            <h2 className="text-2xl font-bold block">Start chatting!</h2>
            <NotFoundIcon className="w-full" />
          </div>
        </div>
      )}
    </>
  );
};
