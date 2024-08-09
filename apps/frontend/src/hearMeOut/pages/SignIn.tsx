import {
  Button,
  Heading,
  Link as LinkRdx,
  Text,
  TextFieldInput
} from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { IconBrandGithub, IconEye, IconEyeClosed } from '@tabler/icons-react';
import { AuthLayout } from '@hearmeout/layouts/AuthLayout';
import { getEnvVariables } from '@helpers/getEnvVariables';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { signIn } from '@services/hearMeOutAPI';
import { HttpStatusCodes } from '@/types/types';

export const SignIn: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (!form.current) return;

    const formData = new FormData(form.current);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    const { status } = await signIn({ username, password });

    if (status >= HttpStatusCodes.BAD_REQUEST) {
      toast.error('Username or password is incorrect');
      return;
    }

    navigate(0);
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <AuthLayout>
      <Heading weight="regular" align="center">
        Sign in
      </Heading>
      <Button
        variant="outline"
        color="iris"
        radius="full"
        size="3"
        className="transition"
        asChild>
        <Link to={`${getEnvVariables().VITE_HEARMEOUT_API}/api/auth/github`}>
          <IconBrandGithub /> Sign in with GitHub
        </Link>
      </Button>
      <Form.Root
        className="flex flex-col gap-6"
        ref={form}
        onSubmit={handleSignIn}>
        <Form.Field name="username" className="flex flex-col gap-2">
          <Form.Label>Username</Form.Label>
          <Form.Control asChild>
            <TextFieldInput placeholder="Jhon Doe" required />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="flex flex-col gap-2 relative">
          <Form.Label>Password</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              placeholder="MyPaSsWoRd1"
              type={isPasswordVisible ? 'text' : 'password'}
              required
            />
          </Form.Control>
          <button
            type="button"
            className="absolute right-2
          bottom-1 cursor-pointer opacity-70"
            aria-label="Toggle password visibility"
            onClick={handleTogglePassword}>
            {isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
          </button>
        </Form.Field>
        <Form.Submit asChild>
          <Button color="iris" variant="soft" className="w-full cursor-pointer">
            Sign in
          </Button>
        </Form.Submit>
      </Form.Root>
      <Text align="center">
        Don't have an account?{' '}
        <LinkRdx color="iris" asChild>
          <Link to="/sign-up">Sign up</Link>
        </LinkRdx>
      </Text>
    </AuthLayout>
  );
};

export default SignIn;
