import type { MessageDetails } from '@store/types/types';
import { useEffect, useRef } from 'react';
import { DateDivider } from '@hearmeout/components/chat/DateDivider';
import { useChatStore } from '@store/chat';
import { Message } from '@hearmeout/components/chat/Message';

interface DateGroup {
  date: string;
  messages: MessageDetails[];
}

export const Messages: React.FC = () => {
  const messageEl = useRef<HTMLDivElement>(null);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const conversations = useChatStore((state) => state.conversations);
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
      className="px-10 md:px-20 flex-1 pt-10 flex flex-col gap-6 overflow-auto"
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
            <div key={date} className="flex flex-col gap-6">
              <DateDivider date={new Date(date)} />

              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  avatar={message.from.avatar}
                  date={new Date(message.createdAt)}
                  name={message.from.username}
                />
              ))}
            </div>
          ))}
    </div>
  );
};
