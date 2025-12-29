'use client';

import { useState, useEffect } from 'react';
import type { GameState } from '@/lib/gameState';

interface GuesserViewProps {
  gameState: GameState;
  isGuesser: boolean;
  onRevealNext: () => void;
  onGuess: (guess: string) => void;
}

export function GuesserView({
  gameState,
  isGuesser,
  onRevealNext,
  onGuess,
}: GuesserViewProps) {
  const [guessInput, setGuessInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer effect
  useEffect(() => {
    if (!gameState.guessTimerEndTime) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((gameState.guessTimerEndTime! - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [gameState.guessTimerEndTime]);

  const sortedSubmissions = [...gameState.submissions].sort(
    (a, b) => a.objectCount - b.objectCount
  );

  const revealedSubmissions = sortedSubmissions.filter((s) => s.revealed);
  const hasMoreToReveal = gameState.revealIndex < sortedSubmissions.length;

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim()) {
      onGuess(guessInput.trim());
      setGuessInput('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 text-center py-4 px-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {isGuesser ? 'Devinez le mot !' : `${gameState.players.find(p => p.id === gameState.currentGuesserId)?.name} cherche...`}
        </p>
        {!isGuesser && gameState.currentWord && (
          <p className="text-2xl font-bold">{gameState.currentWord}</p>
        )}
        {gameState.showHint && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Catégorie : {gameState.currentWordCategory}
          </p>
        )}
        {gameState.guessTimerEndTime && (
          <p className={`text-2xl font-mono font-bold mt-2 ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
            {timeLeft}s
          </p>
        )}
      </div>

      {/* Revealed drawings */}
      <div className="flex-1 overflow-y-auto overscroll-contain py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revealedSubmissions.map((submission, index) => (
            <div
              key={submission.playerId}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {isGuesser ? `Dessin ${index + 1}` : submission.playerName}
                </span>
                <span className="text-sm text-gray-500">
                  {submission.objectCount} {submission.objectCount === 1 ? 'trait' : 'traits'}
                </span>
              </div>
              {/* Drawing image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                {submission.imageData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={submission.imageData}
                    alt={`Dessin de ${submission.playerName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Dessin #{index + 1}</span>
                )}
              </div>
            </div>
          ))}

          {revealedSubmissions.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Aucun dessin révélé pour l&apos;instant
            </div>
          )}
        </div>
      </div>

      {/* Guess history */}
      {gameState.guessHistory.length > 0 && (
        <div className="flex-shrink-0 px-4 py-2 bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-lg">X</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {gameState.guessHistory[gameState.guessHistory.length - 1]}
            </span>
          </div>
          {gameState.guessHistory.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {gameState.guessHistory.slice(0, -1).map((guess, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm line-through opacity-60"
                >
                  {guess}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
        {isGuesser ? (
          <div className="space-y-3">
            <form onSubmit={handleGuess} className="flex gap-3">
              <input
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Votre réponse..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!guessInput.trim()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Deviner
              </button>
            </form>
            {hasMoreToReveal && (
              <button
                onClick={onRevealNext}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                Révéler un dessin
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            {(() => {
              const guesser = gameState.players.find(p => p.id === gameState.currentGuesserId);
              return hasMoreToReveal
                ? `${guesser?.name} réfléchit...`
                : 'Tous les dessins ont été révélés';
            })()}
          </p>
        )}
      </div>
    </div>
  );
}
