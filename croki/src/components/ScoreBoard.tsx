'use client';

import type { Player } from '@/lib/gameState';

interface ScoreBoardProps {
  players: Player[];
  currentGuesserId: string | null;
  currentPlayerId: string;
}

export function ScoreBoard({ players, currentGuesserId, currentPlayerId }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Scores</h2>
      <ul className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.id}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
              player.id === currentPlayerId
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  #{index + 1}
                </span>
                <span className="font-medium">{player.name}</span>
              </div>
              {player.id === currentGuesserId && (
                <div className="mt-1">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                    Devineur
                  </span>
                </div>
              )}
            </div>
            <span className="text-xl font-bold">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
