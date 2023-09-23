import { useChatStore } from '../../store';
import { SidebarConversation } from '.';

export const SidebarContacts = () => {
  const getActiveConversations = useChatStore(
    (state) => state.getActiveConversations
  );

  return (
    <div className="h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] pr-3 pl-2 pt-1 -mt-1 -ml-2 -mr-4 flex flex-col gap-5 overflow-auto">
      {getActiveConversations().map((el) => (
        <SidebarConversation
          key={el.id}
          id={el.id}
          name={el.users[0].username}
          avatarUrl={el.users[0].avatar}
          isOnline={el.users[0].isOnline}
        />
      ))}
    </div>
  );
};
