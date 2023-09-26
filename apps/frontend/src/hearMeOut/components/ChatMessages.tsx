// import { Callout } from '@radix-ui/themes';
import { useChatStore } from '../../store';
import { ChatMessage } from './';
import { useEffect, useRef } from 'react';
// import { IconInfoCircle } from '@tabler/icons-react';

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
        conversation.messages.map(({ id, content, createdAt, from }) => (
          <ChatMessage
            key={id}
            content={content}
            date={new Date(createdAt)}
            avatar={from.avatar}
            name={from.username}
          />
        ))}
      {/* <Callout.Root color="amber">
        <Callout.Icon>
          <IconInfoCircle />
        </Callout.Icon>
        <Callout.Text>
          The user that you are trying to send a message doesn't have you in his
          contacts.
        </Callout.Text>
      </Callout.Root> */}
    </div>
  );
};
