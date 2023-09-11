import {
  Button,
  Heading,
  Link as LinkRdx,
  Text,
  TextFieldInput
} from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';

export const SignUp = () => {
  return (
    <AuthLayout>
      <Heading weight="regular" align="center">
        Sign up
      </Heading>
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
