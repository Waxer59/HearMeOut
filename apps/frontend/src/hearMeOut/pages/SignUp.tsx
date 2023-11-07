import {
  Button,
  Heading,
  Link as LinkRdx,
  Text,
  TextFieldInput
} from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { useRef, useState } from 'react';
import { signUp } from '../../services/hearMeOutAPI';
import { validateSignUp } from '../helpers/validateSignUpForm';
import { toast } from 'sonner';
import { HttpStatusCodes } from '../../types/types';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';

export const SignUp = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: any) => {
    if (!form.current) return;

    e.preventDefault();

    const formData = new FormData(form.current);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      toast.error('Please fill all the fields');
    }

    const validation = validateSignUp({ username, password });

    if (!validation.success) {
      toast.error('Username and password does not meet the requirements');
      return;
    }

    const { data, status } = await signUp({ username, password });

    if (status === HttpStatusCodes.CREATED) {
      toast.success('Account created successfully!');
      setTimeout(() => navigate('/'), 2000);
    } else {
      toast.error(
        data?.message ??
          'There was an error creating your account, please try again'
      );
    }

    form.current.reset();
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <AuthLayout>
      <Heading weight="regular" align="center">
        Sign up
      </Heading>
      <Form.Root className="flex flex-col gap-6" ref={form}>
        <Form.Field name="username" className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Form.Label>Username</Form.Label>
            <Form.Message
              match="valueMissing"
              className="text-[13px] text-red-400 opacity-[0.8]">
              Please enter a username
            </Form.Message>
            <Form.Message
              match={(val) => val.length < 3}
              className="text-[13px] text-red-400 opacity-[0.8]">
              Too short (minimum 3 characters)
            </Form.Message>
            <Form.Message
              match={(val) => val.length > 20}
              className="text-[13px] text-red-400 opacity-[0.8]">
              Too long (maximum 39 characters)
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextFieldInput placeholder="Jhon Doe" required />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <Form.Label>Password</Form.Label>
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
        <Form.Submit asChild>
          <Button
            color="iris"
            variant="soft"
            className="w-full cursor-pointer"
            onClick={handleSignUp}>
            Sign up
          </Button>
        </Form.Submit>
      </Form.Root>
      <Text align="center">
        Already have an account?{' '}
        <LinkRdx color="iris" asChild>
          <Link to="/">Sign in</Link>
        </LinkRdx>
      </Text>
    </AuthLayout>
  );
};

export default SignUp;
