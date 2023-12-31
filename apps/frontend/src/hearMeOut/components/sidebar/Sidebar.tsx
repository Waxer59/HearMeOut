import * as Tabs from '@radix-ui/react-tabs';
import { Profile, Header, Conversation, TabsDivider } from '..';
import { useAccountStore, useChatStore } from '../../../store';
import { VoidIcon } from '../Icons';
import {
  ConversationTypes,
  type ConversationDetails
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
  const chatQueryFilter = useChatStore((state) => state.chatQueryFilter);
  const conversations = useChatStore((state) => state.conversations);
  const getActiveConversations = useChatStore(
    (state) => state.getActiveConversations
  );
  const ownUserId = useAccountStore((state) => state.account?.id);

  if (conversations.length === 0) {
    return (
      <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
        <Header />
        <div className="h-[calc(100vh-224px)] max-h-[calc(100vh-224px)] flex flex-col  justify-center items-center gap-12">
          <VoidIcon className="w-52" />
          <h2 className="font-bold">Add a friend to start talking here</h2>
        </div>
        <Profile />
      </div>
    );
  }

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

  return (
    <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
      <Header />
      <div className="flex flex-col gap-2">
        <Tabs.Root
          className="h-[calc(100vh-224px)] max-h-[calc(100vh-224px)]"
          defaultValue="active">
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
                  value="active"
                  className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                  Active chats
                  <TabsDivider />
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="all"
                  className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
                  All chats
                  <TabsDivider />
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="active" className="h-full">
                <ConversationsLayout>
                  {getSidebarConversations(getActiveConversations())}
                  {getActiveConversations().length <= 0 && (
                    <div className="flex justify-center mt-24">
                      <VoidIcon className="w-52" />
                    </div>
                  )}
                </ConversationsLayout>
              </Tabs.Content>
              <Tabs.Content value="all" className="h-full">
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
