import { Toaster } from 'sonner';
import { ChatSidebar, ChatView } from '../components/';

const Chat = () => {
  return (
    <div className="flex h-full">
      <ChatSidebar />
      <ChatView />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Chat;
