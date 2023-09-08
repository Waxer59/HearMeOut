import * as bcrypt from 'bcrypt';

interface HashOptions {
  raw: string;
  rounds?: number;
}

interface CompareOptions {
  raw: string;
  hash: string;
}

export function generateHash({ raw, rounds = 10 }: HashOptions): string {
  return bcrypt.hashSync(raw, rounds);
}

export function compareHash({ raw, hash }: CompareOptions): boolean {
  return bcrypt.compareSync(raw, hash);
}
