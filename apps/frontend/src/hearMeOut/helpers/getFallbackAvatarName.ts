export const getFallbackAvatarName = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .reduce((acc, curr) => acc + curr[0], '');
