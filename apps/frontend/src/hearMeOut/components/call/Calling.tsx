import {
  CALLING_TONES,
  CALLING_TONES_TIME_INTERVAL
} from '@/constants/constants';
import { useAudio } from '@/hearMeOut/hooks/useAudio';
import { useCallStore } from '@/store/call';
import { useRef, useEffect, useCallback } from 'react';
import { CallInProgress } from './CallInProgress';
import { RecieveCall } from './RecieveCall';
import { MakeCall } from './MakeCall';
import { useSocketChatEvents } from '@/hearMeOut/hooks/useSocketChatEvents';
import { useChatStore } from '@/store/chat';

export const Calling = () => {
  const { playAudio, stopAudio, isAudioPlaying } = useAudio({
    data: '/sounds/calling.mp3'
  });
  const { sendUserLeftCall } = useSocketChatEvents();
  const conversations = useChatStore((state) => state.conversations);
  const callingConversation = useCallStore(
    (state) => state.callingConversation
  );
  const incommingCallsIds = useCallStore((state) => state.incommingCallsIds);
  const isSignaling = useCallStore((state) => state.isSignaling);
  const isCallinProgress = useCallStore((state) => state.isCallinProgress);
  const callIntervalRef = useRef<number | null>(null);

  const clearCallingSound = useCallback(() => {
    stopAudio();
    clearInterval(callIntervalRef.current!);
  }, [stopAudio]);

  const emitCallingSound = useCallback(() => {
    let currentCallingTones = 0;

    playAudio();

    callIntervalRef.current = setInterval(() => {
      if (CALLING_TONES === currentCallingTones) {
        clearInterval(callIntervalRef.current!);

        if (!isCallinProgress) {
          sendUserLeftCall(callingConversation!.id);
        }

        callIntervalRef.current = null;
        return;
      }

      currentCallingTones++;
      playAudio();
    }, CALLING_TONES_TIME_INTERVAL);
  }, [callingConversation, isCallinProgress, playAudio, sendUserLeftCall]);

  useEffect(() => {
    if (!isSignaling || incommingCallsIds.length === 0) {
      clearCallingSound();
    }
  }, [isSignaling, incommingCallsIds, clearCallingSound]);

  useEffect(() => {
    if (isCallinProgress) {
      clearCallingSound();
    }
  }, [clearCallingSound, isCallinProgress]);

  useEffect(() => {
    if (isSignaling || incommingCallsIds.length > 0) {
      if (isAudioPlaying) {
        clearCallingSound();
      }

      emitCallingSound();
    }
  }, [
    isSignaling,
    incommingCallsIds,
    isAudioPlaying,
    emitCallingSound,
    clearCallingSound
  ]);

  return (
    <>
      {incommingCallsIds.map((callId) => {
        const conversation = conversations.find((c) => c.id === callId)!;
        return <RecieveCall callingConversation={conversation} key={callId} />;
      })}
      {isSignaling && callingConversation && (
        <MakeCall callingConversation={callingConversation} />
      )}
      {isCallinProgress && callingConversation && (
        <CallInProgress callingConversation={callingConversation} />
      )}
    </>
  );
};
