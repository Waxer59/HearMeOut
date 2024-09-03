import { getFallbackAvatarName } from '@/hearMeOut/helpers/getFallbackAvatarName';
import { Avatar, Heading } from '@radix-ui/themes';

interface Props {
  name: string;
  avatar?: string;
}

export const UserInCall: React.FC<Props> = ({ name, avatar }) => (
  <div className="flex flex-col gap-2 items-center">
    <Avatar fallback={getFallbackAvatarName(name)} src={avatar} size="4" />
    <Heading as="h3" className="capitalize text-sm text-center">
      {name}
    </Heading>
  </div>
);
