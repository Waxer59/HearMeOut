import { z } from 'zod';

const signUpSchema = z.object({
  username: z.string().min(3).max(39),
  password: z.string().min(8)
});

export function validateSignUp(data: any) {
  return signUpSchema.safeParse(data);
}
