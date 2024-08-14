import { Button, TextField } from '@radix-ui/themes';
import { IconSend } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { JOIN_CODE_LENGTH } from '@constants';
import { useSocketChatEvents } from '@hearmeout/hooks/useSocketChatEvents';

interface Props {
  closeDialog: () => void;
}

export const JoinGroupOption: React.FC<Props> = ({ closeDialog }) => {
  const codeInput = useRef<HTMLInputElement>(null);
  const { sendJoinGroup } = useSocketChatEvents();

  const handleJoinGroup = () => {
    const code = codeInput.current?.value;

    if (!code) {
      toast.error('Please enter a group code');
      return;
    }

    if (code?.length !== JOIN_CODE_LENGTH) {
      toast.error('Invalid group code');
      return;
    }

    sendJoinGroup(code);
    closeDialog();
  };

  return (
    <div className="flex items-center gap-2">
      <TextField.Root size="3" variant="soft" color="gray" className="w-full">
        <TextField.Input placeholder="Group code" ref={codeInput} />
      </TextField.Root>
      <Button
        color="blue"
        size="3"
        className="cursor-pointer"
        onClick={handleJoinGroup}>
        <IconSend />
      </Button>
    </div>
  );
};
