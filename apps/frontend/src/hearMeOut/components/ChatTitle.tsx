import { Badge, Button, Heading, Tooltip } from '@radix-ui/themes';
import { IconUsersGroup } from '@tabler/icons-react';
import { useChatStore } from '../../store';
import { ConversationTypes } from '../../store/types/types';

export const ChatTitle: React.FC = () => {
  const { currentConversationId, conversations } = useChatStore(
    (state) => state
  );

  const conversation = conversations.find(
    (el) => el.id === currentConversationId
  );
  return (
    <div className="flex justify-end items-center px-20 pt-5 py-4 shadow-[0px_4px_4px_0px_#00000040]">
      <Heading
        as="h2"
        weight="bold"
        className="text-lg text-start w-full uppercase flex">
        {conversation?.name ?? conversation?.users[0].username}
        {conversation?.type === ConversationTypes.chat &&
          (conversation?.users[0].isOnline ? (
            <Badge color="green" className="ml-auto">
              online
            </Badge>
          ) : (
            <Badge color="gray" className="ml-auto">
              offline
            </Badge>
          ))}
      </Heading>
      {conversation?.type === ConversationTypes.group && (
        <Tooltip content="Members">
          <Button variant="ghost" className="transition">
            <IconUsersGroup />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
