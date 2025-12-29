'use client';

import type { GameState } from '@/lib/gameState';

interface RoundEndProps {
  gameState: GameState;
  isHost: boolean;
  onNextRound: () => void;
}

export function RoundEnd({ gameState, isHost, onNextRound }: RoundEndProps) {
  const guesser = gameState.players.find(
    (p) => p.id === gameState.currentGuesserId
  );

  const sortedSubmissions = [...gameState.submissions].sort(
    (a, b) => a.objectCount - b.objectCount
  );

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto overscroll-contain">
      {/* Result header */}
      <div className="text-center">
        <div className="text-5xl mb-2">
          {gameState.correctGuess ? '🎉' : '😢'}
        </div>
        <h2 className="text-2xl font-bold mb-1">
          {gameState.correctGuess ? 'Bravo !' : 'Raté !'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Le mot était : <strong className="text-xl">{gameState.currentWord}</strong>
        </p>
        {gameState.correctGuess && guesser && (
          <p className="text-green-600 dark:text-green-400 mt-2">
            {guesser.name} a deviné correctement !
          </p>
        )}
      </div>

      {/* All drawings */}
      <div>
        <h3 className="font-medium mb-3 text-center">Tous les dessins :</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedSubmissions.map((submission) => (
            <div
              key={submission.playerId}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="font-medium truncate">{submission.playerName}</span>
                <span className="text-gray-500 text-xs">
                  {submission.objectCount} {submission.objectCount === 1 ? 'trait' : 'traits'}
                </span>
              </div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                {submission.imageData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={submission.imageData}
                    alt={`Dessin de ${submission.playerName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Pas d&apos;image
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 max-w-md mx-auto w-full">
        <h3 className="font-medium mb-3 text-center">Classement :</h3>
        <ul className="space-y-2 text-sm">
          {[...gameState.players]
            .sort((a, b) => b.score - a.score)
            .map((p, index) => (
              <li key={p.id} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span>{p.name}</span>
                  {p.id === gameState.currentGuesserId && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded">
                      Devineur
                    </span>
                  )}
                </span>
                <span className="font-bold">{p.score}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Next button */}
      <div className="max-w-md mx-auto w-full">
        {isHost ? (
          <button
            onClick={onNextRound}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            {gameState.roundNumber >= gameState.totalRounds
              ? 'Voir les résultats'
              : 'Prochaine manche'}
          </button>
        ) : (
          <p className="text-gray-500 text-center">
            En attente de l&apos;hôte pour continuer...
          </p>
        )}
      </div>
    </div>
  );
}
