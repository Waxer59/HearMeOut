export function excludeUserFields<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): any {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
  );
}
