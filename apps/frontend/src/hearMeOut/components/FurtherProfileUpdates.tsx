import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import * as Form from '@radix-ui/react-form';
import { Button, Heading, TextFieldInput } from '@radix-ui/themes';
import { useRef, useState, type FormEvent } from 'react';
import { updateUserAccount } from '../../services/hearMeOutAPI';
import { HttpStatusCodes } from '../../types/types';
import { toast } from 'sonner';

export const FurtherProfileUpdates: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(form.current!);
    const password = formData.get('password') as string;

    const data = await updateUserAccount({ password });
    if (data.status >= HttpStatusCodes.BAD_REQUEST) {
      toast.error('There was an error changing your password');
    } else {
      toast.success('Password changed successfully');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Heading
        as="h2"
        size="8"
        className="text-left border-b-[1px] border-b-slate-300 pb-2 w-full">
        Change password
      </Heading>
      <Form.Root className="w-full mt-8 flex flex-col gap-8" ref={form}>
        <Form.Field name="password" className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <Form.Label>New password</Form.Label>
            <Form.Message
              match="valueMissing"
              className="text-[13px] text-red-400 opacity-[0.8]">
              Please enter a password
            </Form.Message>
            <Form.Message
              match={(val) => val.length < 8}
              className="text-[13px] text-red-400 opacity-[0.8]">
              Too short (minimum 8 characters)
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextFieldInput
              placeholder="MyPaSsWoRd1"
              type={isPasswordVisible ? 'text' : 'password'}
              required
            />
          </Form.Control>
          <button
            className="absolute right-2
    bottom-1 cursor-pointer opacity-70"
            onClick={handleTogglePassword}>
            {isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
          </button>
        </Form.Field>
        <Form.Field
          name="password-repeat"
          className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <Form.Label>Repeat password</Form.Label>
            <Form.Message
              match={(val) => {
                const formData = new FormData(form.current!);
                return val !== formData.get('password');
              }}
              className="text-[13px] text-red-400 opacity-[0.8]">
              Passwords do not match
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextFieldInput
              placeholder="MyPaSsWoRd1"
              type={isPasswordVisible ? 'text' : 'password'}
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <Button variant="outline" onClick={handleChangePassword}>
            Save
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};
