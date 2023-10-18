import { useChatStore } from '../../store';
import type { MessageDetails } from '../../store/types/types';
import { ChatMessage } from './';
import { useEffect, useRef } from 'react';
import { DateDivider } from './DateDivider';

interface DateGroup {
  date: string;
  messages: MessageDetails[];
}

export const ChatMessages = () => {
  const { currentConversationId, conversations } = useChatStore(
    (state) => state
  );
  const messageEl = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(
    (el) => el.id === currentConversationId
  );

  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.scrollTop = messageEl.current.scrollHeight;
    }
  }, [conversation?.messages]);

  return (
    <div
      className="px-20 flex-1 pt-10 flex flex-col gap-6 overflow-auto"
      ref={messageEl}>
      {conversation?.messages &&
        conversation.messages
          .reduce((acc: DateGroup[], message) => {
            const { createdAt } = message;
            const dateGroup = acc.find(
              (group) => group.date === new Date(createdAt).toDateString()
            );

            if (dateGroup) {
              dateGroup.messages.push(message);
            } else {
              acc.push({
                date: new Date(createdAt).toDateString(),
                messages: [message]
              });
            }

            return acc;
          }, [])
          .map(({ date, messages }) => (
            <div key={date}>
              <DateDivider date={new Date(date)} />

              {messages.map(({ id, content, createdAt, from }) => (
                <ChatMessage
                  key={id}
                  content={content}
                  date={new Date(createdAt)}
                  avatar={from.avatar}
                  name={from.username}
                />
              ))}
            </div>
          ))}
    </div>
  );
};
