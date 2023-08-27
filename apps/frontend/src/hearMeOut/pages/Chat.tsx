import { ChatSidebar, ChatView } from '../components/';

const Chat = () => {
  return (
    <div className="flex h-full">
      <ChatSidebar />
      <ChatView />
    </div>
  );
};

export default Chat;
