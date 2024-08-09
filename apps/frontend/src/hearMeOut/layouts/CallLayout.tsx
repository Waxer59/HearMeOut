import { Avatar, Heading } from '@radix-ui/themes';
import Draggable from 'react-draggable';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';

interface Props {
  children: React.ReactNode;
  name: string;
  avatar?: string;
}

export const CallLayout: React.FC<Props> = ({ children, name, avatar }) => {
  return (
    <Draggable bounds="parent">
      <div className="absolute bg-secondary p-4 rounded-lg flex items-center flex-col gap-4 cursor-move right-10 top-10">
        <Avatar fallback={getFallbackAvatarName(name)} src={avatar} size="7" />
        <Heading as="h2" className="capitalize">
          {name}
        </Heading>
        {children}
      </div>
    </Draggable>
  );
};
