'use client';

import Link from 'next/link';
import type { GameState } from '@/lib/gameState';

interface GameOverProps {
  gameState: GameState;
}

export function GameOver({ gameState }: GameOverProps) {
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-lg">
        <div className="text-6xl mb-4">🏆</div>

        <h2 className="text-3xl font-bold mb-2">Partie terminée!</h2>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          <strong className="text-yellow-500">{winner.name}</strong> gagne avec{' '}
          <strong>{winner.score}</strong> points!
        </p>

        {/* Final rankings */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 mb-6">
          <h3 className="font-medium mb-3">Classement final:</h3>
          <ul className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <li
                key={player.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  index === 0
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : index === 1
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : index === 2
                    ? 'bg-orange-100 dark:bg-orange-900/30'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="text-xl font-bold">{player.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="block w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-center"
        >
          Nouvelle partie
        </Link>
      </div>
    </div>
  );
}
