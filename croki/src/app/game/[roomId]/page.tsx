'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { useGame } from '@/lib/useGame';
import { Lobby } from '@/components/Lobby';
import { DrawerView } from '@/components/DrawerView';
import { GuesserView } from '@/components/GuesserView';
import { ScoreBoard } from '@/components/ScoreBoard';
import { RoundEnd } from '@/components/RoundEnd';
import { GameOver } from '@/components/GameOver';
import { InitialConnectionScreen, ReconnectOverlay } from '@/components/ReconnectOverlay';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function GameRoom({ params }: PageProps) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const playerName = searchParams.get('name') || 'Joueur';
  const [showScores, setShowScores] = useState(false);

  const {
    gameState,
    connected,
    currentPlayer,
    isGuesser,
    isHost,
    playerId,
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
  } = useGame(roomId, playerName);

  if (!gameState) {
    return <InitialConnectionScreen />;
  }

  return (
    <>
      {!connected && <ReconnectOverlay />}
      <main className="h-dvh flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-950 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-500">Cr</span>
            <span className="text-orange-500">o</span>
            <span className="text-green-500">ki</span>
          </h1>
          <span className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {roomId}
          </span>
        </div>

        {gameState.phase !== 'waiting' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Manche {gameState.roundNumber}/{gameState.totalRounds}
            </span>
            <button
              onClick={() => setShowScores(!showScores)}
              className="lg:hidden px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Scores
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Game area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {gameState.phase === 'waiting' && (
            <Lobby
              gameState={gameState}
              isHost={isHost}
              currentPlayer={currentPlayer}
              onToggleReady={toggleReady}
              onChangeName={changeName}
              onStartGame={startGame}
              onSetTimer={setTimer}
              onSetTotalRounds={setTotalRounds}
              onSetDifficulty={setDifficulty}
              onToggleHint={toggleHint}
              roomId={roomId}
            />
          )}

          {gameState.phase === 'drawing' && !isGuesser && (
            <DrawerView
              gameState={gameState}
              onSubmit={submitDrawing}
              hasSubmitted={currentPlayer?.hasSubmitted ?? false}
            />
          )}

          {gameState.phase === 'drawing' && isGuesser && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl max-w-md">
                <p className="text-2xl mb-2">Vous devinez !</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Attendez que les autres joueurs finissent de dessiner...
                </p>
                <Timer endTime={gameState.timerEndTime} />
              </div>
            </div>
          )}

          {gameState.phase === 'revealing' && (
            <GuesserView
              gameState={gameState}
              isGuesser={isGuesser}
              onRevealNext={revealNext}
              onGuess={guess}
            />
          )}

          {gameState.phase === 'round_end' && (
            <RoundEnd
              gameState={gameState}
              isHost={isHost}
              onNextRound={nextRound}
            />
          )}

          {gameState.phase === 'game_over' && (
            <GameOver gameState={gameState} />
          )}
        </div>

        {/* Sidebar - Scoreboard (desktop) */}
        {gameState.phase !== 'waiting' && (
          <aside className="hidden lg:block lg:w-64 p-4 border-l border-gray-200 dark:border-gray-800">
            <ScoreBoard
              players={gameState.players}
              currentGuesserId={gameState.currentGuesserId}
              currentPlayerId={playerId}
            />
          </aside>
        )}
      </div>

      {/* Mobile score modal */}
      {showScores && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowScores(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[60vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Scores</h2>
              <button onClick={() => setShowScores(false)} className="text-gray-500 text-xl">x</button>
            </div>
            <ScoreBoard
              players={gameState.players}
              currentGuesserId={gameState.currentGuesserId}
              currentPlayerId={playerId}
            />
          </div>
        </div>
      )}
    </main>
    </>
  );
}

function Timer({ endTime }: { endTime: number | null }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!endTime) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mt-4 text-3xl font-mono font-bold">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
