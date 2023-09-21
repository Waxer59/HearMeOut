import {
  Avatar,
  Button,
  Heading,
  Select,
  Text,
  TextField,
  Tooltip
} from '@radix-ui/themes';
import { IconSend } from '@tabler/icons-react';

const USERS = ['SERGIO', 'JOSE', 'JUAN', 'JUAN PABLO'];

export const SidebarCreateGroupOption = () => {
  return (
    <div className="flex flex-col gap-8">
      <TextField.Root size="3" variant="soft" color="gray">
        <TextField.Input placeholder="Group name" />
      </TextField.Root>
      <div className="w-full flex flex-col gap-3">
        <Heading as="h3" size="3">
          Add users to group
        </Heading>
        <Select.Root>
          <Select.Trigger placeholder="Contacts" />
          <Select.Content color="blue">
            {USERS.map((el, idx) => (
              <Select.Item value={el} key={idx}>
                {el}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <div className="w-full flex flex-col gap-3">
        <Heading as="h3" size="3">
          Selected contacts
        </Heading>
        <Text weight="light">
          Select a minimum of two people to create a group...
        </Text>
        <div className="flex flex-wrap gap-4 pl-2">
          <Tooltip content="Click to remove">
            <Button
              variant="ghost"
              className="flex gap-2 transition"
              radius="medium">
              <Avatar fallback="J" />
              <Text weight="bold" className="uppercase">
                Juan
              </Text>
            </Button>
          </Tooltip>
        </div>
      </div>
      <Button color="blue" size="3">
        Create
        <IconSend />
      </Button>
    </div>
  );
};
