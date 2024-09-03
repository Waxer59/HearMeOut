import * as Tabs from '@radix-ui/react-tabs';
import { VoidIcon } from '@hearmeout/components/Icons';
import { type ConversationDetails, TabsEnum } from '@store/types/types';
import { useChatStore } from '@store/chat';
import { useUiStore } from '@store/ui';
import { TabsDivider } from '@hearmeout/components/TabsDivider';
import { Conversation } from '@hearmeout/components/sidebar/Conversation';
import { Header } from '@hearmeout/components/sidebar/Header';
import { Profile } from '@hearmeout/components/sidebar/Profile';
import { getConversationName } from '@hearmeout/helpers/getConversationName';
import { getConversationAvatar } from '@hearmeout/helpers/getConversationAvatar';
import { getConversationIsOnline } from '@hearmeout/helpers/getConversationIsOnline';

export const Sidebar: React.FC = () => {
  const chatQueryFilter = useUiStore((state) => state.chatQueryFilter);
  const conversations = useChatStore((state) => state.conversations);
  const getActiveConversations = useChatStore(
    (state) => state.getActiveConversations
  );
  const setIsInActiveConversationsTab = useUiStore(
    (state) => state.setIsInActiveConversationsTab
  );
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  const getSidebarConversations = (conversations: ConversationDetails[]) =>
    conversations.map((c) => {
      return (
        <Conversation
          key={c.id}
          id={c.id}
          name={getConversationName(c)}
          imageURL={getConversationAvatar(c)}
          isOnline={getConversationIsOnline(c)}
          type={c.type}
        />
      );
    });

  const handleTabChange = (tab: string) => {
    setIsInActiveConversationsTab(tab === TabsEnum.ACTIVE);
  };

  if (conversations.length === 0) {
    return (
      <div
        className={`w-80 bg-secondary h-full px-5 pt-5 absolute md:relative flex flex-col gap-8 z-10 md:translate-x-0 transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <Header />
        <div className="h-[calc(100dvh-224px)] max-h-[calc(100dvh-224px)] flex flex-col  justify-center items-center gap-12">
          <VoidIcon className="w-52" />
          <h2 className="font-bold">Add a friend to start talking here</h2>
        </div>
        <Profile />
      </div>
    );
  }

  return (
    <div
      className={`w-80 bg-secondary h-full px-5 pt-5 absolute md:relative flex flex-col gap-8 z-10 md:translate-x-0 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <Header />
      <div className="flex flex-col gap-2">
        <Tabs.Root
          className="h-[calc(100dvh-224px)] max-h-[calc(100dvh-224px)]"
          defaultValue={TabsEnum.ACTIVE}
          onValueChange={handleTabChange}>
          {chatQueryFilter ? (
            <ConversationsLayout>
              {getSidebarConversations(
                conversations?.filter((c) =>
                  getConversationName(c)
                    .toLowerCase()
                    .includes(chatQueryFilter.toLowerCase())
                )
              )}
            </ConversationsLayout>
          ) : (
            <>
              <Tabs.List className="flex justify-evenly mb-4">
                <Tabs.Trigger
                  value={TabsEnum.ACTIVE}
                  className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                  Active chats
                  <TabsDivider />
                </Tabs.Trigger>
                <Tabs.Trigger
                  value={TabsEnum.ALL}
                  className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                  All chats
                  <TabsDivider />
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value={TabsEnum.ACTIVE} className="h-full">
                <ConversationsLayout>
                  {getSidebarConversations(getActiveConversations())}
                  {getActiveConversations().length <= 0 && (
                    <div className="flex justify-center mt-24">
                      <VoidIcon className="w-52" />
                    </div>
                  )}
                </ConversationsLayout>
              </Tabs.Content>
              <Tabs.Content value={TabsEnum.ALL} className="h-full">
                <ConversationsLayout>
                  {getSidebarConversations(conversations)}
                </ConversationsLayout>
              </Tabs.Content>
            </>
          )}
        </Tabs.Root>
        <Profile />
      </div>
    </div>
  );
};

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout: React.FC<ConversationsLayoutProps> = ({
  children
}) => (
  <div className="h-[calc(100%-40px)] pr-3 pl-2 pt-1 -mt-1 -ml-2 -mr-4 flex flex-col gap-5 overflow-auto">
    {children}
  </div>
);
