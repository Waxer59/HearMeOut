import { IconPhoneOff } from '@tabler/icons-react';
import { CallLayout } from '@hearmeout/layouts/CallLayout';
import { Button } from '@radix-ui/themes';

export const MakeCall: React.FC = () => {
  return (
    <CallLayout name="Hugo">
      <Button color="red" variant="soft" className="cursor-pointer w-full">
        <IconPhoneOff />
      </Button>
    </CallLayout>
  );
};
