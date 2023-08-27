import { SidebarContact } from './';

export const SidebarContacts = () => {
  return (
    <div className="h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] pr-3 pl-2 pt-1 -mt-1 -ml-2 -mr-4 flex flex-col gap-5 overflow-auto">
      {Array.from({ length: 80 }, (_, i) => i).map((i) => (
        <SidebarContact key={i} name="Hugo" />
      ))}
    </div>
  );
};
