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

export const SignIn = () => {
  return (
    <div className="flex flex-col gap-5 mt-48 w-[90%] max-w-[400px] mx-auto bg-secondary p-9 rounded-xl shadow-lg">
      <Heading weight="regular" align="center">
        Sign in
      </Heading>
      <Button variant="outline" radius="full" size="3" className="transition">
        <IconBrandGithub /> Sign in with GitHub
      </Button>
      <Form.Root className="flex flex-col gap-6">
        <Form.Field name="user" className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Form.Label>Username</Form.Label>
            <Form.Message
              match="valueMissing"
              className="text-[13px] text-red-400 opacity-[0.8]">
              Please enter a username
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextFieldInput placeholder="Jhon Doe" required />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Form.Label>Password</Form.Label>
            <Form.Message
              match="valueMissing"
              className="text-[13px] text-red-400 opacity-[0.8]">
              Please enter a password
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextFieldInput
              placeholder="MyPaSsWoRd1"
              type="password"
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <Button color="iris" variant="soft" className="w-full">
            Sign in
          </Button>
        </Form.Submit>
      </Form.Root>
      <Text align="center">
        Don't have an account?{' '}
        <LinkRdx asChild>
          <Link to="/sign-up">Sign up</Link>
        </LinkRdx>
      </Text>
    </div>
  );
};

export default SignIn;
