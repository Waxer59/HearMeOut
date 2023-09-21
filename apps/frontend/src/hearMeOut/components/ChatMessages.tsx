import { useChatStore } from '../../store';
import { ChatMessage } from './';

export const ChatMessages = () => {
  const activeChat = useChatStore((state) => state.active);

  return (
    <div className="px-20 flex-1 pt-10 flex flex-col gap-6 overflow-auto">
      {/* {activeChat &&
        activeChat.messages.map(({ id, content, createdAt, from }) => (
          <ChatMessage
            key={id}
            content={content}
            date={createdAt}
            avatar={from.avatar}
            name={from.username}
          />
        ))} */}
    </div>
  );
};
