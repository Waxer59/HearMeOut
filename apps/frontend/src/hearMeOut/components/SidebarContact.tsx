import { Avatar, Button } from '@radix-ui/themes';

interface Props {
  name: string;
}

export const SidebarContact = ({ name }: Props) => {
  return (
    <Button
      variant="ghost"
      radius="large"
      className="flex items-center justify-start gap-3 font-bold uppercase text-lg w-full transition">
      <Avatar fallback="G" />
      {name}
    </Button>
  );
};
