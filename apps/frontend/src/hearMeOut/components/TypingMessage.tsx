import { BeatLoader } from 'react-spinners';

interface Props {
  usernames: string[];
}

export const TypingMessage: React.FC<Props> = ({ usernames }) => {
  return (
    <>
      {usernames.length ? (
        <div className="flex gap-2 items-center text-md absolute bottom-4">
          <BeatLoader color="white" size={10} speedMultiplier={0.5} />
          {usernames.length >= 5 ? (
            <span className="font-bold">
              Everyone <span className="font-normal">is typing...</span>
            </span>
          ) : (
            <span>
              {usernames.map((username, idx) => (
                <span key={username} className="font-bold">
                  {`${username + (idx < usernames.length - 1 ? ',' : '')} `}
                </span>
              ))}{' '}
              <span>{usernames.length > 1 ? 'are' : 'is'} typing...</span>
            </span>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
