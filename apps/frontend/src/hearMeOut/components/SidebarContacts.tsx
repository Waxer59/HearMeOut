import { useChatStore } from '../../store';
import { SidebarContact } from './';

export const SidebarContacts = () => {
  const chats = useChatStore((state) => state.chats);

  return (
    <div className="h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] pr-3 pl-2 pt-1 -mt-1 -ml-2 -mr-4 flex flex-col gap-5 overflow-auto">
      {chats && chats.map((el) => <SidebarContact key={el.id} name="Hugo" />)}
    </div>
  );
};
