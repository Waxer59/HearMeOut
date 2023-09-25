import * as Tabs from '@radix-ui/react-tabs';
import {
  SidebarProfile,
  SidebarActiveConversations,
  SidebarHeader,
  SidebarAllConversations
} from './';

export const ChatSidebar = () => {
  return (
    <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
      <SidebarHeader />

      <div className="flex flex-col gap-2">
        <Tabs.Root
          className="h-[calc(100vh-224px)] max-h-[calc(100vh-220px)]"
          defaultValue="active">
          <Tabs.List className="flex justify-between mb-4">
            <Tabs.Trigger
              value="active"
              className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
              Active chats
              <div className="h-1 w-full bg-white rounded opacity-70 group-data-[state=inactive]:hidden"></div>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="all"
              className="data-[state=active]:opacity-70 transition uppercase font-bold flex flex-col gap-2 group">
              All chats
              <div className="h-1 w-full bg-white rounded opacity-70 group-data-[state=inactive]:hidden"></div>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="active" className="h-full">
            <SidebarActiveConversations />
          </Tabs.Content>
          <Tabs.Content value="all" className="h-full">
            <SidebarAllConversations />
          </Tabs.Content>
        </Tabs.Root>
        <SidebarProfile />
      </div>
    </div>
  );
};
