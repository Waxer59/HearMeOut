import { Button } from '@radix-ui/themes';
import { IconPhone, IconPhoneOff } from '@tabler/icons-react';
import { CallLayout } from '../../layouts/CallLayout';

export const Call = () => {
  return (
    <CallLayout name="Hugo">
      <div className="flex gap-4 items-center">
        <Button color="green" variant="soft" className="cursor-pointer">
          <IconPhone />
        </Button>
        <Button color="red" variant="soft" className="cursor-pointer">
          <IconPhoneOff />
        </Button>
      </div>
    </CallLayout>
  );
};
