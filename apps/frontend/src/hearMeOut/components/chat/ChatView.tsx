import { Messages, Input, Title } from '.';
import { useChatStore } from '../../../store';
import { NotFoundIcon } from '../Icons';

export const ChatView: React.FC = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );

  return (
    <>
      {currentConversationId ? (
        <div className="flex flex-col flex-1 justify-between h-screen">
          <Title />
          <Messages />
          <Input />
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center gap-32 h-screen">
          <h2 className="text-2xl font-bold">Start chatting!</h2>
          <NotFoundIcon className="w-96" />
        </div>
      )}
    </>
  );
};
