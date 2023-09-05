import bcrypt from 'bcrypt';

interface HashOptions {
  raw: string;
  rounds?: number;
  fn?: (err: Error, hash: string) => void;
}

interface CompareOptions {
  raw: string;
  hash: string;
  fn?: (err: Error, result: boolean) => void;
}

export function generateHash({
  raw,
  rounds = 10,
  fn = () => null,
}: HashOptions) {
  return bcrypt.hash(raw, rounds, fn);
}

export function compareHash({ raw, hash, fn }: CompareOptions) {
  return bcrypt.compare(raw, hash, fn);
}
