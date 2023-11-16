import * as Tabs from '@radix-ui/react-tabs';
import {
  SidebarProfile,
  SidebarHeader,
  SidebarConversation,
  TabsDivider
} from '.';
import { useChatStore } from '../../store';
import { VoidIcon } from './Icons';
import { useEffect } from 'react';
import {
  ConversationTypes,
  type ConversationDetails
} from '../../store/types/types';
import { HttpStatusCodes } from '../../types/types';
import { toast } from 'sonner';
import { getAllConversationMessages } from '../../services/hearMeOutAPI';

const getConversationName = (c: ConversationDetails): string =>
  c.type === ConversationTypes.group ? c.name! : c.users[0].username;

const getConversationAvatar = (c: ConversationDetails): string | undefined =>
  c.type === ConversationTypes.group ? c.icon ?? undefined : c.users[0].avatar;

export const ConversationsSidebar: React.FC = () => {
  const chatQueryFilter = useChatStore((state) => state.chatQueryFilter);
  const {
    conversations,
    setConversationMessages,
    currentConversationId,
    getActiveConversations,
    clearReplyMessage
  } = useChatStore((state) => state);

  useEffect(() => {
    async function fetchMessages() {
      if (!currentConversationId) {
        return;
      }

      const { data, status } = await getAllConversationMessages(
        currentConversationId
      );

      if (status >= HttpStatusCodes.BAD_REQUEST) {
        toast.error('There was an error fetching messages');
      }

      setConversationMessages(currentConversationId, data);
    }
    // clear replying message while navigating between chats
    clearReplyMessage();
    fetchMessages();
  }, [currentConversationId]);

  return (
    <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
      <SidebarHeader />
      <div className="flex flex-col gap-2">
        {conversations.length > 0 ? (
          <Tabs.Root
            className="h-[calc(100vh-224px)] max-h-[calc(100vh-224px)]"
            defaultValue="active">
            {chatQueryFilter ? (
              conversations
                ?.filter((c) =>
                  getConversationName(c)
                    .toLowerCase()
                    .includes(chatQueryFilter.toLowerCase())
                )
                ?.map((el) => (
                  <SidebarConversation
                    key={el.id}
                    id={el.id}
                    name={getConversationName(el)}
                    avatarUrl={getConversationAvatar(el)}
                    isOnline={el.users[0].isOnline}
                    type={el.type}
                  />
                ))
            ) : (
              <>
                <Tabs.List className="flex justify-between mb-4">
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
                    {getActiveConversations().map((el) => (
                      <SidebarConversation
                        key={el.id}
                        id={el.id}
                        name={
                          el.type === ConversationTypes.group
                            ? el.name!
                            : el.users[0].username
                        }
                        avatarUrl={
                          el.type === ConversationTypes.group
                            ? el.icon ?? undefined
                            : el.users[0].avatar
                        }
                        isOnline={el.users[0].isOnline}
                        type={el.type}
                      />
                    ))}
                    {getActiveConversations().length <= 0 && (
                      <div className="flex justify-center mt-24">
                        <VoidIcon className="w-52" />
                      </div>
                    )}
                  </ConversationsLayout>
                </Tabs.Content>
                <Tabs.Content value="all" className="h-full">
                  <ConversationsLayout>
                    {conversations.map((el) => (
                      <SidebarConversation
                        key={el.id}
                        id={el.id}
                        name={
                          el.type === ConversationTypes.group
                            ? el.name!
                            : el.users[0].username
                        }
                        avatarUrl={
                          el.type === ConversationTypes.group
                            ? el.icon ?? undefined
                            : el.users[0].avatar
                        }
                        isOnline={el.users[0].isOnline}
                        type={el.type}
                      />
                    ))}
                  </ConversationsLayout>
                </Tabs.Content>
              </>
            )}
          </Tabs.Root>
        ) : (
          <div className="h-[calc(100vh-224px)] max-h-[calc(100vh-224px)] flex flex-col items-center gap-12 pt-24">
            <VoidIcon className="w-52" />
            <h2 className="font-bold">Add a friend to start talking here</h2>
          </div>
        )}
        <SidebarProfile />
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
