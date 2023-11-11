import * as Tabs from '@radix-ui/react-tabs';
import {
  SidebarProfile,
  SidebarActiveConversations,
  SidebarHeader,
  SidebarAllConversations,
  SidebarConversation,
  TabsDivider
} from '.';
import { useChatStore } from '../../store';
import { VoidIcon } from './Icons';
import { ConversationTypes } from '../../store/types/types';

export const ConversationsSidebar = () => {
  const conversations = useChatStore((state) => state.conversations);
  const chatQueryFilter = useChatStore((state) => state.chatQueryFilter);

  return (
    <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
      <SidebarHeader />
      <div className="flex flex-col gap-2">
        {chatQueryFilter &&
          conversations
            ?.filter((c) => c.name === chatQueryFilter)
            ?.map((el) => (
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
        {conversations.length > 0 && !chatQueryFilter ? (
          <Tabs.Root
            className="h-[calc(100vh-224px)] max-h-[calc(100vh-224px)]"
            defaultValue="active">
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
              <SidebarActiveConversations />
            </Tabs.Content>
            <Tabs.Content value="all" className="h-full">
              <SidebarAllConversations />
            </Tabs.Content>
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
