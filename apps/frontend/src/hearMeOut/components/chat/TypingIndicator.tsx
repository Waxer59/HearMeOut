import { BeatLoader } from 'react-spinners';
import type { UserTyping } from '../../../store/types/types';
import { useChatStore } from '../../../store';

interface Props {
  usersTyping: UserTyping[];
}

export const TypingIndicator: React.FC<Props> = ({ usersTyping }) => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const conversation = useChatStore((state) => state.conversations).find(
    (el) => el.id === currentConversationId
  );
  const currentConversationUsersTyping = usersTyping.filter(
    (el) => el.conversationId === currentConversationId
  );
  const usernames = currentConversationUsersTyping.map(
    (el) => conversation?.users.find((user) => user.id === el.userId)?.username
  );

  return (
    <>
      <div
        className={`flex gap-2 items-center text-md absolute bottom-4 transition ${
          usernames?.length ? 'block' : 'hidden'
        }`}>
        <BeatLoader color="gray" size={10} speedMultiplier={0.5} />
        {usernames.length >= 5 ? (
          <span className="font-bold">
            Everyone <span className="font-normal">is typing...</span>
          </span>
        ) : (
          <span>
            {usernames.map((username, idx) => (
              <span key={username} className="font-bold capitalize">
                {`${username + (idx < usernames.length - 1 ? ',' : '')} `}
              </span>
            ))}{' '}
            <span>{usernames.length > 1 ? 'are' : 'is'} typing...</span>
          </span>
        )}
      </div>
    </>
  );
};
