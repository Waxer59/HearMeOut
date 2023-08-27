import { SidebarContact } from './';

export const SidebarContacts = () => {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 10 }, (_, i) => i).map((i) => (
        <SidebarContact key={i} name="Hugo" />
      ))}
    </div>
  );
};
