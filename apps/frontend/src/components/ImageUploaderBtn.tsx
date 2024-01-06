import { Avatar, Tooltip } from '@radix-ui/themes';
import { getFallbackAvatarName } from '../hearMeOut/helpers';
import { useRef, type ChangeEvent } from 'react';

interface Props {
  title: string;
  imageURL?: string;
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
  size: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
}

export const ImageUploaderBtn: React.FC<Props> = ({
  title,
  imageURL,
  handleChangeImage,
  size
}) => {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Tooltip content="Change image">
        <button onClick={() => fileInput.current?.click()}>
          <Avatar
            fallback={getFallbackAvatarName(title)}
            src={imageURL}
            width="40px"
            size={size}
          />
        </button>
      </Tooltip>
      <input
        type="file"
        className="hidden"
        ref={fileInput}
        accept="image/*"
        onChange={handleChangeImage}
      />
    </>
  );
};
