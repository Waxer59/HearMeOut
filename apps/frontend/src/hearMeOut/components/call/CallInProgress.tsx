import { Avatar, Button, Heading } from '@radix-ui/themes';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff
} from '@tabler/icons-react';
import { useState } from 'react';
import { getFallbackAvatarName } from '@hearmeout/helpers/getFallbackAvatarName';

export const CallInProgress: React.FC = () => {
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const handleMuteMicrophone = () => {
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  return (
    <CallLayout name="Hugo">
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={handleMuteMicrophone}>
          {isMicrophoneOn ? <IconMicrophone /> : <IconMicrophoneOff />}
        </Button>
        <Button color="red" variant="soft" className="cursor-pointer">
          <IconPhoneOff />
        </Button>
      </div>
      <div className="flex gap-4 items-center max-w-[200px] overflow-auto pb-2">
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
        <UserInCall name="Hugo" />
      </div>
    </CallLayout>
  );
};

interface PropsUserInCall {
  name: string;
  avatar?: string;
}

const UserInCall: React.FC<PropsUserInCall> = ({ name, avatar }) => (
  <div className="flex flex-col gap-2 items-center">
    <Avatar fallback={getFallbackAvatarName(name)} src={avatar} size="4" />
    <Heading as="h3" className="capitalize text-sm text-center">
      {name}
    </Heading>
  </div>
);
