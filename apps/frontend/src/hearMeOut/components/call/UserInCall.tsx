import { getFallbackAvatarName } from '@/hearMeOut/helpers/getFallbackAvatarName';
import { Avatar, Heading } from '@radix-ui/themes';

interface Props {
  name: string;
  avatar?: string;
  isMuted?: boolean;
}

export const UserInCall: React.FC<Props> = ({ name, avatar, isMuted }) => (
  <li className="flex flex-col gap-2 items-center">
    <Avatar
      fallback={getFallbackAvatarName(name)}
      src={avatar}
      size="4"
      className={`${isMuted ? 'animate-pulse' : ''}`}
    />
    <Heading as="h3" className="capitalize text-sm text-center">
      {name}
    </Heading>
  </li>
);
