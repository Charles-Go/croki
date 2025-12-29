export type GamePhase =
  | 'waiting'      // Lobby, waiting for players
  | 'drawing'      // Drawers are drawing
  | 'revealing'    // Drawings being revealed one by one
  | 'round_end'    // Round ended, showing scores
  | 'game_over';   // Game complete

export type GameDifficulty = 'facile' | 'moyen' | 'difficile' | 'mixte';

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  objectCount?: number;  // Submitted object count for current round
  hasSubmitted: boolean; // Whether player has submitted their drawing
}

export interface DrawingSubmission {
  playerId: string;
  playerName: string;
  objectCount: number;
  revealed: boolean;
  imageData?: string; // Base64 encoded PNG image of the drawing
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentGuesserId: string | null;
  currentWord: string | null;
  currentWordCategory: string | null;
  timerDuration: number;       // Timer in seconds (60, 90, 120)
  timerEndTime: number | null; // Unix timestamp when timer ends
  guessTimerEndTime: number | null; // Unix timestamp when guess timer ends (30s)
  showHint: boolean;           // Whether to show category hint
  difficulty: GameDifficulty;  // Word difficulty level
  submissions: DrawingSubmission[];
  revealIndex: number;         // Current index in reveal order
  roundNumber: number;
  totalRounds: number;
  correctGuess: boolean;       // Whether guesser got it right this round
  guessHistory: string[];      // Previous guesses this reveal phase
}

export interface GameMessage {
  type:
    | 'join'
    | 'leave'
    | 'ready'
    | 'change_name'
    | 'start_game'
    | 'set_timer'
    | 'set_total_rounds'
    | 'set_difficulty'
    | 'toggle_hint'
    | 'submit_drawing'
    | 'reveal_next'
    | 'guess'
    | 'next_round'
    | 'sync_state';
  payload?: unknown;
}

export interface SetTotalRoundsPayload {
  totalRounds: number;
}

export interface SetDifficultyPayload {
  difficulty: GameDifficulty;
}

export interface JoinPayload {
  playerName: string;
}

export interface ChangeNamePayload {
  newName: string;
}

export interface SetTimerPayload {
  duration: number; // 60, 90, or 120
}

export interface SubmitDrawingPayload {
  objectCount: number;
  imageData: string; // Base64 encoded PNG image
}

export interface GuessPayload {
  guess: string;
}

export const initialGameState: GameState = {
  phase: 'waiting',
  players: [],
  currentGuesserId: null,
  currentWord: null,
  currentWordCategory: null,
  timerDuration: 90,
  timerEndTime: null,
  guessTimerEndTime: null,
  showHint: true,
  difficulty: 'mixte',
  submissions: [],
  revealIndex: 0,
  roundNumber: 0,
  totalRounds: 0,
  correctGuess: false,
  guessHistory: [],
};
