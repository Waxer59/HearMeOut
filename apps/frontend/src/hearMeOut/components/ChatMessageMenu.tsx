import { IconArrowBackUp, IconEdit, IconTrash } from '@tabler/icons-react';

interface Props {
  type: any;
}

export const ChatMessageMenu: React.FC<Props> = ({ type, ...props }) => {
  const MenuType = type;
  return (
    <MenuType.Content {...props}>
      <MenuType.Item className="flex items-center gap-2 cursor-pointer">
        Reply <IconArrowBackUp size={18} />
      </MenuType.Item>
      <MenuType.Item className="flex items-center gap-2 cursor-pointer">
        Edit <IconEdit size={18} />
      </MenuType.Item>
      <MenuType.Separator />
      <MenuType.Item
        color="red"
        className="flex items-center gap-2 cursor-pointer">
        Delete <IconTrash size={18} />
      </MenuType.Item>
    </MenuType.Content>
  );
};
