'use client';

import { useState } from 'react';
import type { GameState, Player, GameDifficulty } from '@/lib/gameState';

interface LobbyProps {
  gameState: GameState;
  isHost: boolean;
  currentPlayer: Player | undefined;
  onToggleReady: () => void;
  onChangeName: (newName: string) => void;
  onStartGame: () => void;
  onSetTimer: (duration: number) => void;
  onSetTotalRounds: (rounds: number) => void;
  onSetDifficulty: (difficulty: string) => void;
  onToggleHint: () => void;
  roomId: string;
}

export function Lobby({
  gameState,
  isHost,
  currentPlayer,
  onToggleReady,
  onChangeName,
  onStartGame,
  onSetTimer,
  onSetTotalRounds,
  onSetDifficulty,
  onToggleHint,
  roomId,
}: LobbyProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentPlayer?.name || '');
  const [copied, setCopied] = useState(false);

  const canStart =
    gameState.players.length >= 3 &&
    gameState.players.every((p) => p.isReady || p.isHost);

  const handleNameSubmit = () => {
    if (nameInput.trim() && nameInput.trim() !== currentPlayer?.name) {
      onChangeName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/game/${roomId}`
    : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback for older browsers
      console.error('Failed to copy:', e);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start p-4 overflow-y-auto overscroll-contain">
      <div className="max-w-md w-full space-y-6 py-4">
        {/* Share link */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Partagez ce lien pour inviter des joueurs :
          </p>
          <div className="flex gap-2">
            <code className="flex-1 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg text-sm truncate">
              {shareUrl}
            </code>
            <button
              onClick={copyLink}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white scale-105'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Game settings (host only) */}
        {isHost && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Temps par manche :</p>
              <div className="flex gap-2">
                {[60, 90, 120].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onSetTimer(duration)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      gameState.timerDuration === duration
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Nombre de manches :</p>
              <div className="flex gap-2">
                {[1, 2, 3].map((multiplier) => {
                  const rounds = gameState.players.length * multiplier;
                  return (
                    <button
                      key={multiplier}
                      onClick={() => onSetTotalRounds(rounds)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        gameState.totalRounds === rounds
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {rounds}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {gameState.players.length} joueur{gameState.players.length > 1 ? 's' : ''} = chacun devine {gameState.totalRounds / gameState.players.length || 1} fois
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Difficulté :</p>
              <div className="flex gap-2">
                {(['facile', 'moyen', 'difficile', 'mixte'] as GameDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => onSetDifficulty(diff)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${
                      gameState.difficulty === diff
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Indice (catégorie)</p>
                <p className="text-xs text-gray-500">Afficher la catégorie du mot</p>
              </div>
              <button
                onClick={onToggleHint}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  gameState.showHint ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    gameState.showHint ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Your name */}
        {currentPlayer && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-sm font-medium mb-3">Votre nom :</p>
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                />
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-3 py-2 rounded-lg">
                <span className="font-medium">{currentPlayer.name}</span>
                <button
                  onClick={() => {
                    setNameInput(currentPlayer.name);
                    setIsEditingName(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Modifier
                </button>
              </div>
            )}
          </div>
        )}

        {/* Players list */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm font-medium mb-3">
            Joueurs ({gameState.players.length}) :
          </p>
          <ul className="space-y-2">
            {gameState.players.map((player) => (
              <li
                key={player.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  player.id === currentPlayer?.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {player.name}
                  {player.isHost && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                      Hôte
                    </span>
                  )}
                </span>
                <span
                  className={`text-sm ${
                    player.isReady || player.isHost
                      ? 'text-green-500'
                      : 'text-gray-400'
                  }`}
                >
                  {player.isReady || player.isHost ? 'Prêt' : 'En attente'}
                </span>
              </li>
            ))}
          </ul>

          {gameState.players.length < 3 && (
            <p className="text-sm text-orange-500 mt-3">
              Il faut au moins 3 joueurs pour commencer
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {!isHost && (
            <button
              onClick={onToggleReady}
              className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors ${
                currentPlayer?.isReady
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {currentPlayer?.isReady ? 'Prêt!' : 'Je suis prêt'}
            </button>
          )}

          {isHost && (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {canStart ? 'Lancer la partie' : 'En attente des joueurs...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
