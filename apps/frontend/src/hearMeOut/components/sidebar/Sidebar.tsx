import * as Tabs from '@radix-ui/react-tabs';
import { Profile, Header, Conversation, TabsDivider } from '..';
import { useAccountStore, useChatStore, useUiStore } from '../../../store';
import { VoidIcon } from '../Icons';
import {
  ConversationTypes,
  type ConversationDetails,
  TabsEnum
} from '../../../store/types/types';

const getConversationName = (
  c: ConversationDetails,
  userInChatName = ''
): string => (c.type === ConversationTypes.group ? c.name : userInChatName);

const getConversationAvatar = (
  c: ConversationDetails,
  userInChatAvatar: string | undefined
): string | undefined =>
  c.type === ConversationTypes.group ? c.icon : userInChatAvatar;

const getConversationIsOnline = (
  c: ConversationDetails,
  userInChatIsOnline = false
): boolean => (c.type === ConversationTypes.group ? false : userInChatIsOnline);

export const Sidebar: React.FC = () => {
  const chatQueryFilter = useUiStore((state) => state.chatQueryFilter);
  const conversations = useChatStore((state) => state.conversations);
  const getActiveConversations = useChatStore(
    (state) => state.getActiveConversations
  );
  const ownUserId = useAccountStore((state) => state.account)!.id;
  const setIsInActiveConversationsTab = useUiStore(
    (state) => state.setIsInActiveConversationsTab
  );
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  const getSidebarConversations = (conversations: ConversationDetails[]) =>
    conversations.map((c) => {
      const userInChat = c.users.find((c) => c.id !== ownUserId)!;
      return (
        <Conversation
          key={c.id}
          id={c.id}
          name={getConversationName(c, userInChat.username)}
          imageURL={getConversationAvatar(c, userInChat.avatar)}
          isOnline={getConversationIsOnline(c, userInChat.isOnline)}
          type={c.type}
        />
      );
    });

  const handleTabChange = (tab: string) => {
    setIsInActiveConversationsTab(tab === TabsEnum.ACTIVE);
  };

  if (conversations.length === 0) {
    return (
      <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
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
                  getConversationName(
                    c,
                    c.users.find((u) => u.id !== ownUserId)?.username
                  )
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
