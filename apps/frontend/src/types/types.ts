import { type ChangeEvent } from 'react';

export type InputEvent = ChangeEvent<HTMLInputElement>;
export type ButtonEvent = ChangeEvent<HTMLButtonElement>;
export type TextAreaEvent = ChangeEvent<HTMLTextAreaElement>;

export interface EmojiProps {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}
