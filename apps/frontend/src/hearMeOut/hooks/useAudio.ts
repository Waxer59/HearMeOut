import { useEffect, useRef, useState } from 'react';

interface Props {
  data: string;
}

export const useAudio = ({ data }: Props) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(data);
  }, []);

  useEffect(() => {
    if (!isAudioPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isAudioPlaying]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    setIsAudioPlaying(true);
  };

  const stopAudio = () => {
    setIsAudioPlaying(false);
  };

  return {
    playAudio,
    stopAudio,
    isAudioPlaying
  };
};
