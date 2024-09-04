import {
  CALLING_TONES,
  CALLING_TONES_TIME_INTERVAL
} from '@/constants/constants';
import { useAudio } from '@/hearMeOut/hooks/useAudio';
import { useCallStore } from '@/store/call';
import { useRef, useEffect } from 'react';
import { CallInProgress } from './CallInProgress';
import { RecieveCall } from './RecieveCall';
import { MakeCall } from './MakeCall';

export const Calling = () => {
  const { playAudio, stopAudio, isAudioPlaying } = useAudio({
    data: '/sounds/calling.mp3'
  });
  const callingConversation = useCallStore(
    (state) => state.callingConversation
  );
  const isSignaling = useCallStore((state) => state.isSignaling);
  const isCallinProgress = useCallStore((state) => state.isCallinProgress);
  const isRecevingCall = useCallStore((state) => state.isRecevingCall);
  const callIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSignaling || !isRecevingCall) {
      clearCallingSound();
    }
  }, [isSignaling, isRecevingCall]);

  useEffect(() => {
    if (isCallinProgress) {
      clearCallingSound();
    }
  }, [isCallinProgress]);

  useEffect(() => {
    if (isSignaling || isRecevingCall) {
      if (isAudioPlaying) {
        clearCallingSound();
      }

      emitCallingSound();
    }
  }, [isSignaling, isRecevingCall]);

  const clearCallingSound = () => {
    stopAudio();
    clearInterval(callIntervalRef.current!);
  };

  const emitCallingSound = () => {
    let currentCallingTones = 0;

    playAudio();

    callIntervalRef.current = setInterval(() => {
      if (CALLING_TONES === currentCallingTones) {
        clearInterval(callIntervalRef.current!);
        callIntervalRef.current = null;
        return;
      }

      currentCallingTones++;
      playAudio();
    }, CALLING_TONES_TIME_INTERVAL);
  };
  return (
    <>
      {isRecevingCall && callingConversation && (
        <RecieveCall callingConversation={callingConversation} />
      )}
      {isSignaling && callingConversation && (
        <MakeCall callingConversation={callingConversation} />
      )}
      {isCallinProgress && callingConversation && (
        <CallInProgress callingConversation={callingConversation} />
      )}
    </>
  );
};
