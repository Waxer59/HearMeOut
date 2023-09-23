import { ChatMessages, ChatInput, ChatTitle } from './';

export const ChatView = () => {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <ChatTitle />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
