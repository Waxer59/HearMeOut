export const parseCookies = (raw: string): { [key: string]: string } | null => {
  if (!raw) {
    return null;
  }

  const cookies = raw.split(';');
  const parsedCookies: { [key: string]: string } = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    parsedCookies[key.trim().toLowerCase()] = value;
  });

  return parsedCookies;
};
