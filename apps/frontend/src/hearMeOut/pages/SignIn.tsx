import {
  Button,
  Heading,
  Link as LinkRdx,
  Text,
  TextFieldInput
} from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Link } from 'react-router-dom';
import { IconBrandGithub } from '@tabler/icons-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { useRef } from 'react';

export const SignIn = () => {
  const form = useRef<HTMLFormElement | null>(null);

  // TODO: TYPE THIS
  const handleSignIn = async (e: any) => {
    if (!form.current) return;

    e.preventDefault();

    const formData = new FormData(form.current);

    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) return;

    console.log({ username, password });
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
        <Link to={`${getEnvVariables().VITE_HEARMEOUT_API}/auth/github`}>
          <IconBrandGithub /> Sign in with GitHub
        </Link>
      </Button>
      <Form.Root className="flex flex-col gap-6" ref={form}>
        <Form.Field name="username" className="flex flex-col gap-2">
          <Form.Label>Username</Form.Label>
          <Form.Control asChild>
            <TextFieldInput placeholder="Jhon Doe" required />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="flex flex-col gap-2">
          <Form.Label>Password</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              placeholder="MyPaSsWoRd1"
              type="password"
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild onSubmit={handleSignIn}>
          <Button color="iris" variant="soft" className="w-full">
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
