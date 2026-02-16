'use client';

import { useState, useEffect } from 'react';

export function InitialConnectionScreen() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* Logo */}
      <h1 className="text-6xl font-black tracking-tight mb-10 select-none">
        <span className="text-blue-500">Cr</span>
        <span className="text-orange-500">o</span>
        <span className="text-green-500">ki</span>
      </h1>

      {/* Pulsing dots */}
      <div className="flex gap-2.5 mb-8">
        {[
          'bg-blue-500',
          'bg-orange-500',
          'bg-green-500',
        ].map((color, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${color}`}
            style={{
              animation: 'pulse-dot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-500">
        Connexion à la partie...
      </p>
    </div>
  );
}

export function ReconnectOverlay() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center">
        {/* Pulsing connection indicator */}
        <div className="relative w-14 h-14 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full bg-orange-500/20" style={{ animation: 'ping-slow 1.5s ease-out infinite' }} />
          <div className="absolute inset-0 rounded-full bg-orange-500/10" style={{ animation: 'ping-slow 1.5s ease-out infinite 0.5s' }} />
          <div className="absolute inset-2 rounded-full bg-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Reconnexion...
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          La connexion a été interrompue. Reconnexion automatique en cours.
        </p>

        {/* Reassurance card */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Votre partie est préservée — vous serez reconnecté automatiquement.
          </p>
        </div>

        {/* Elapsed timer (shows after 5s) */}
        {elapsed >= 5 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Tentative depuis {elapsed}s...
          </p>
        )}
      </div>
    </div>
  );
}
