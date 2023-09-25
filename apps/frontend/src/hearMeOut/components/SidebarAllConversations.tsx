import { useChatStore } from '../../store';
import { SidebarConversation } from '.';
import { useEffect } from 'react';
import { getAllConversationMessages } from '../../services/hearMeOutAPI';
import { HttpStatusCodes } from '../../types/types';
import { toast } from 'sonner';

export const SidebarAllConversations = () => {
  const { conversations, setConversationMessages, currentConversationId } =
    useChatStore((state) => state);

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

    fetchMessages();
  }, [currentConversationId]);

  return (
    <div className="h-full pr-3 pl-2 pt-1 -mt-1 -ml-2 -mr-4 flex flex-col gap-5 overflow-auto">
      {conversations.map((el) => (
        <SidebarConversation
          key={el.id}
          id={el.id}
          name={el.users[0].username}
          avatarUrl={el.users[0].avatar}
          isOnline={el.users[0].isOnline}
          isActive={false}
        />
      ))}
    </div>
  );
};
