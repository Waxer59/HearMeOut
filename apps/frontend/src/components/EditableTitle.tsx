import {
  Button,
  Dialog,
  Heading,
  IconButton,
  TextFieldInput
} from '@radix-ui/themes';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
  title: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  onChangeTitle: (title: string) => void;
}

export const EditableTitle: React.FC<Props> = ({
  title,
  onChangeTitle,
  as,
  size
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveNewTitle = () => {
    onChangeTitle(newTitle);
    setNewTitle('');
    setIsOpen(false);
  };
  return (
    <div className="flex items-center gap-4 justify-center w-full">
      <Heading
        as={as}
        size={size}
        className="capitalize max-w-[10ch] text-center">
        {title}
      </Heading>
      <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
        <Dialog.Trigger>
          <IconButton className="transition cursor-pointer">
            <IconPencil className="text-tertiary" />
          </IconButton>
        </Dialog.Trigger>
        <Dialog.Content className="max-w-md">
          <Dialog.Title>Change username</Dialog.Title>

          <div className="flex flex-col gap-4">
            <TextFieldInput
              placeholder={title}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Dialog.Close>
                <Button variant="soft" color="red">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button onClick={handleSaveNewTitle} className="text-tertiary">
                  Save
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
