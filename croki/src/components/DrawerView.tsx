'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { GameState } from '@/lib/gameState';
import type { CanvasHandle } from './Canvas';

// Import tldraw dynamically to avoid SSR issues
const Canvas = dynamic(() => import('./Canvas').then(mod => ({ default: mod.Canvas })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
      <p>Chargement du canvas...</p>
    </div>
  ),
});

interface DrawerViewProps {
  gameState: GameState;
  onSubmit: (objectCount: number, imageData: string) => void;
  hasSubmitted: boolean;
}

export function DrawerView({ gameState, onSubmit, hasSubmitted }: DrawerViewProps) {
  const [objectCount, setObjectCount] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);

  // Timer
  useEffect(() => {
    if (!gameState.timerEndTime) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((gameState.timerEndTime! - Date.now()) / 1000));
      setTimeLeft(remaining);

      // Auto-submit when timer ends
      if (remaining === 0 && !hasSubmitted && !isSubmitting) {
        handleSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [gameState.timerEndTime, hasSubmitted, isSubmitting]);

  const handleCountChange = (count: number) => {
    setObjectCount(count);
  };

  const handleSubmit = async () => {
    if (objectCount === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Capture the canvas image
      const imageData = await canvasRef.current?.getImageData();
      if (imageData) {
        onSubmit(objectCount, imageData);
      } else {
        // Submit without image if capture fails
        onSubmit(objectCount, '');
      }
    } catch (e) {
      console.error('Failed to capture image:', e);
      onSubmit(objectCount, '');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const guesser = gameState.players.find(p => p.id === gameState.currentGuesserId);

  if (hasSubmitted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 bg-green-100 dark:bg-green-900/30 rounded-2xl max-w-md">
          <p className="text-2xl mb-2">Dessin proposé !</p>
          <p className="text-gray-600 dark:text-gray-400">
            En attente des autres joueurs...
          </p>
          <p className="mt-4 text-sm">
            {objectCount} {objectCount === 1 ? 'trait' : 'traits'}
          </p>
          <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
            {guesser?.name} devine
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Word to draw */}
      <div className="flex-shrink-0 text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Dessinez pour <span className="text-purple-600 dark:text-purple-400 font-medium">{guesser?.name}</span> :
        </p>
        <p className="text-3xl font-bold">{gameState.currentWord}</p>
        {gameState.showHint && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Catégorie : {gameState.currentWordCategory}
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="flex-shrink-0 text-center pb-4">
        <span className={`font-mono text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 touch-none">
          <Canvas
            ref={canvasRef}
            onCountObjects={handleCountChange}
            onSubmit={() => setShowSubmitModal(true)}
            objectCount={objectCount}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Object count and submit - hidden on mobile (in toolbar) */}
      <div className="flex-shrink-0 py-4 hidden md:flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Traits dessinés :
          </span>
          <span className="text-2xl font-bold min-w-[3ch] text-center">
            {objectCount}
          </span>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          disabled={objectCount === 0 || isSubmitting}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {isSubmitting ? 'Envoi...' : 'Proposer'}
        </button>
      </div>

      {/* Confirmation modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold">Confirmer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez dessiné <strong>{objectCount}</strong> {objectCount === 1 ? 'trait' : 'traits'}.
            </p>
            <p className="text-sm text-orange-500">
              Attention : les dessins avec moins de traits seront révélés en premier !
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleSubmit();
                  setShowSubmitModal(false);
                }}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors"
              >
                {isSubmitting ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
