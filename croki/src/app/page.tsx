'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'select' | 'join'>('select');

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    const roomId = generateRoomId();
    router.push(`/game/${roomId}?name=${encodeURIComponent(playerName.trim())}`);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    router.push(
      `/game/${roomCode.toLowerCase().trim()}?name=${encodeURIComponent(playerName.trim())}`
    );
  };

  return (
    <main className="h-dvh flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-blue-500">Cr</span>
            <span className="text-orange-500">o</span>
            <span className="text-green-500">ki</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Dessinez avec des lignes et des cercles
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
          >
            Votre nom
          </label>
          <input
            id="name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Entrez votre nom..."
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {mode === 'select' ? (
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={!playerName.trim()}
              className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Créer une partie
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--background)] text-gray-500">
                  ou
                </span>
              </div>
            </div>

            <button
              onClick={() => setMode('join')}
              disabled={!playerName.trim()}
              className="w-full py-4 px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-xl transition-colors"
            >
              Rejoindre une partie
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium mb-2"
              >
                Code de la partie
              </label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toLowerCase())}
                placeholder="abcdef"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || roomCode.length < 6}
              className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Rejoindre
            </button>

            <button
              onClick={() => setMode('select')}
              className="w-full py-3 px-6 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
            >
              Retour
            </button>
          </div>
        )}

        {/* Rules hint */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>3+ joueurs</p>
          <p>Dessinez uniquement avec des lignes et des cercles!</p>
        </div>
      </div>
    </main>
  );
}
