import { Toaster } from 'sonner';
import { ChatSidebar, ChatView } from '../components/';

const Chat = () => {
  return (
    <>
      <div className="flex h-full">
        <ChatSidebar />
        <ChatView />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export default Chat;
