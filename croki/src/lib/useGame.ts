'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import usePartySocket from 'partysocket/react';
import type { GameState, GameMessage } from './gameState';

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999';

export function useGame(roomId: string, playerName: string) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connected, setConnected] = useState(false);
  const hasJoined = useRef(false);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    onOpen() {
      setConnected(true);
      // Join the game
      if (!hasJoined.current) {
        hasJoined.current = true;
        socket.send(
          JSON.stringify({
            type: 'join',
            payload: { playerName },
          })
        );
      }
    },
    onClose() {
      setConnected(false);
    },
    onMessage(event) {
      // Skip binary messages (Yjs sync data)
      if (typeof event.data !== 'string') return;

      try {
        const msg: GameMessage = JSON.parse(event.data);
        if (msg.type === 'sync_state') {
          setGameState(msg.payload as GameState);
        }
      } catch (e) {
        // Ignore non-JSON messages (likely Yjs sync)
      }
    },
  });

  const sendMessage = useCallback(
    (message: GameMessage) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    },
    [socket]
  );

  const toggleReady = useCallback(() => {
    sendMessage({ type: 'ready' });
  }, [sendMessage]);

  const changeName = useCallback(
    (newName: string) => {
      sendMessage({ type: 'change_name', payload: { newName } });
    },
    [sendMessage]
  );

  const startGame = useCallback(() => {
    sendMessage({ type: 'start_game' });
  }, [sendMessage]);

  const setTimer = useCallback(
    (duration: number) => {
      sendMessage({ type: 'set_timer', payload: { duration } });
    },
    [sendMessage]
  );

  const toggleHint = useCallback(() => {
    sendMessage({ type: 'toggle_hint' });
  }, [sendMessage]);

  const setTotalRounds = useCallback(
    (totalRounds: number) => {
      sendMessage({ type: 'set_total_rounds', payload: { totalRounds } });
    },
    [sendMessage]
  );

  const setDifficulty = useCallback(
    (difficulty: string) => {
      sendMessage({ type: 'set_difficulty', payload: { difficulty } });
    },
    [sendMessage]
  );

  const submitDrawing = useCallback(
    (objectCount: number, imageData: string) => {
      sendMessage({ type: 'submit_drawing', payload: { objectCount, imageData } });
    },
    [sendMessage]
  );

  const revealNext = useCallback(() => {
    sendMessage({ type: 'reveal_next' });
  }, [sendMessage]);

  const guess = useCallback(
    (guessText: string) => {
      sendMessage({ type: 'guess', payload: { guess: guessText } });
    },
    [sendMessage]
  );

  const nextRound = useCallback(() => {
    sendMessage({ type: 'next_round' });
  }, [sendMessage]);

  // Get current player
  const currentPlayer = gameState?.players.find(
    (p) => p.id === socket.id
  );

  // Check if current player is the guesser
  const isGuesser = gameState?.currentGuesserId === socket.id;

  // Check if current player is the host
  const isHost = currentPlayer?.isHost ?? false;

  return {
    gameState,
    connected,
    currentPlayer,
    isGuesser,
    isHost,
    playerId: socket.id,
    toggleReady,
    changeName,
    startGame,
    setTimer,
    setTotalRounds,
    setDifficulty,
    toggleHint,
    submitDrawing,
    revealNext,
    guess,
    nextRound,
  };
}
