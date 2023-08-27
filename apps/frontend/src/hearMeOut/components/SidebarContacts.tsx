import { SidebarContact } from './';

export const SidebarContacts = () => {
  return (
    <div className="flex flex-col gap-5 max-h-[calc(100vh-220px)] overflow-x-hidden">
      {Array.from({ length: 20 }, (_, i) => i).map((i) => (
        <SidebarContact key={i} name="Hugo" />
      ))}
    </div>
  );
};
