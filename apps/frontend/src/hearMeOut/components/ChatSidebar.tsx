import { SidebarProfile, SidebarContacts, SidebarHeader } from './';

export const ChatSidebar = () => {
  return (
    <div className="w-80 bg-secondary h-full px-5 pt-5 flex flex-col gap-8">
      <SidebarHeader />

      <div className="flex flex-col gap-2">
        <SidebarContacts />
        <SidebarProfile />
      </div>
    </div>
  );
};
