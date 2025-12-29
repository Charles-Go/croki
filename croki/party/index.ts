import type * as Party from 'partykit/server';
import type {
  GameState,
  GameMessage,
  GameDifficulty,
  Player,
  JoinPayload,
  ChangeNamePayload,
  SetTimerPayload,
  SetTotalRoundsPayload,
  SetDifficultyPayload,
  SubmitDrawingPayload,
  GuessPayload,
} from '../src/lib/gameState';
import { getRandomWord, type Difficulty } from '../src/lib/words';

// Normalize text: remove accents, handle ligatures, lowercase, trim
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/œ/g, 'oe') // Handle œ ligature
    .replace(/æ/g, 'ae') // Handle æ ligature
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' '); // Normalize spaces
}

// Calculate Levenshtein distance between two strings
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Check if guess is close enough to the word
function isGuessCorrect(guess: string, word: string): boolean {
  const normalizedGuess = normalizeText(guess);
  const normalizedWord = normalizeText(word);

  // Exact match after normalization
  if (normalizedGuess === normalizedWord) {
    return true;
  }

  // Allow typos based on word length
  const distance = levenshtein(normalizedGuess, normalizedWord);
  const wordLength = normalizedWord.length;

  // Tolerance: 1 error for words <= 5 chars, 2 for <= 10, 3 for longer
  let tolerance = 1;
  if (wordLength > 10) {
    tolerance = 3;
  } else if (wordLength > 5) {
    tolerance = 2;
  }

  return distance <= tolerance;
}

export default class CrokiServer implements Party.Server {
  gameState: GameState;
  usedWords: string[] = [];

  constructor(readonly room: Party.Room) {
    this.gameState = {
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
      totalRounds: 3, // Default to 3 rounds
      correctGuess: false,
      guessHistory: [],
    };
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Send current game state to new connection
    conn.send(
      JSON.stringify({
        type: 'sync_state',
        payload: this.gameState,
      })
    );
  }

  onClose(conn: Party.Connection) {
    // Remove player from game
    const playerId = conn.id;
    const playerIndex = this.gameState.players.findIndex(
      (p) => p.id === playerId
    );

    if (playerIndex !== -1) {
      const wasHost = this.gameState.players[playerIndex].isHost;
      this.gameState.players.splice(playerIndex, 1);

      // Assign new host if needed
      if (wasHost && this.gameState.players.length > 0) {
        this.gameState.players[0].isHost = true;
      }

      // If we're in the middle of a game, handle player leaving
      if (this.gameState.phase !== 'waiting') {
        // If guesser left, skip to next round
        if (playerId === this.gameState.currentGuesserId) {
          this.startNextRound();
        }
        // Remove their submission if any
        this.gameState.submissions = this.gameState.submissions.filter(
          (s) => s.playerId !== playerId
        );
      }

      this.broadcastState();
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const msg: GameMessage = JSON.parse(message);
      this.handleMessage(msg, sender);
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  }

  handleMessage(msg: GameMessage, sender: Party.Connection) {
    switch (msg.type) {
      case 'join':
        this.handleJoin(msg.payload as JoinPayload, sender);
        break;
      case 'change_name':
        this.handleChangeName(msg.payload as ChangeNamePayload, sender);
        break;
      case 'ready':
        this.handleReady(sender);
        break;
      case 'start_game':
        this.handleStartGame(sender);
        break;
      case 'set_timer':
        this.handleSetTimer(msg.payload as SetTimerPayload, sender);
        break;
      case 'set_total_rounds':
        this.handleSetTotalRounds(msg.payload as SetTotalRoundsPayload, sender);
        break;
      case 'set_difficulty':
        this.handleSetDifficulty(msg.payload as SetDifficultyPayload, sender);
        break;
      case 'toggle_hint':
        this.handleToggleHint(sender);
        break;
      case 'submit_drawing':
        this.handleSubmitDrawing(msg.payload as SubmitDrawingPayload, sender);
        break;
      case 'reveal_next':
        this.handleRevealNext(sender);
        break;
      case 'guess':
        this.handleGuess(msg.payload as GuessPayload, sender);
        break;
      case 'next_round':
        this.handleNextRound(sender);
        break;
    }
  }

  handleJoin(payload: JoinPayload, sender: Party.Connection) {
    const existingPlayer = this.gameState.players.find(
      (p) => p.id === sender.id
    );
    if (existingPlayer) return;

    const isHost = this.gameState.players.length === 0;
    const player: Player = {
      id: sender.id,
      name: payload.playerName,
      score: 0,
      isHost,
      isReady: false,
      hasSubmitted: false,
    };

    this.gameState.players.push(player);
    this.broadcastState();
  }

  handleChangeName(payload: ChangeNamePayload, sender: Party.Connection) {
    // Only allow name changes in waiting phase
    if (this.gameState.phase !== 'waiting') return;

    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (player && payload.newName.trim()) {
      player.name = payload.newName.trim().slice(0, 20); // Limit to 20 chars
      this.broadcastState();
    }
  }

  handleReady(sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (player) {
      player.isReady = !player.isReady;
      this.broadcastState();
    }
  }

  handleStartGame(sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.players.length < 3) return;

    // All players must be ready
    const allReady = this.gameState.players.every((p) => p.isReady || p.isHost);
    if (!allReady) return;

    // Start the game
    // Use configured totalRounds or default to player count
    if (this.gameState.totalRounds === 0) {
      this.gameState.totalRounds = this.gameState.players.length;
    }
    this.gameState.roundNumber = 1;
    this.usedWords = [];

    // Random player is the first guesser
    const randomIndex = Math.floor(Math.random() * this.gameState.players.length);
    this.gameState.currentGuesserId = this.gameState.players[randomIndex].id;
    this.startDrawingPhase();
  }

  handleSetTimer(payload: SetTimerPayload, sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.phase !== 'waiting') return;

    if ([60, 90, 120].includes(payload.duration)) {
      this.gameState.timerDuration = payload.duration;
      this.broadcastState();
    }
  }

  handleSetTotalRounds(payload: SetTotalRoundsPayload, sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.phase !== 'waiting') return;

    // Accept any positive number (should be multiple of player count from UI)
    if (payload.totalRounds > 0 && payload.totalRounds <= 30) {
      this.gameState.totalRounds = payload.totalRounds;
      this.broadcastState();
    }
  }

  handleSetDifficulty(payload: SetDifficultyPayload, sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.phase !== 'waiting') return;

    const validDifficulties: GameDifficulty[] = ['facile', 'moyen', 'difficile', 'mixte'];
    if (validDifficulties.includes(payload.difficulty)) {
      this.gameState.difficulty = payload.difficulty;
      this.broadcastState();
    }
  }

  handleToggleHint(sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.phase !== 'waiting') return;

    this.gameState.showHint = !this.gameState.showHint;
    this.broadcastState();
  }

  handleSubmitDrawing(payload: SubmitDrawingPayload, sender: Party.Connection) {
    if (this.gameState.phase !== 'drawing') return;
    if (sender.id === this.gameState.currentGuesserId) return;

    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player || player.hasSubmitted) return;

    player.hasSubmitted = true;
    player.objectCount = payload.objectCount;

    this.gameState.submissions.push({
      playerId: sender.id,
      playerName: player.name,
      objectCount: payload.objectCount,
      revealed: false,
      imageData: payload.imageData,
    });

    // Check if all drawers have submitted
    const drawers = this.gameState.players.filter(
      (p) => p.id !== this.gameState.currentGuesserId
    );
    const allSubmitted = drawers.every((p) => p.hasSubmitted);

    if (allSubmitted) {
      this.startRevealPhase();
    }

    this.broadcastState();
  }

  handleRevealNext(sender: Party.Connection) {
    if (this.gameState.phase !== 'revealing') return;
    // Only guesser can reveal
    if (sender.id !== this.gameState.currentGuesserId) return;

    // Sort submissions by object count (ascending) if not already
    const sorted = [...this.gameState.submissions].sort(
      (a, b) => a.objectCount - b.objectCount
    );
    this.gameState.submissions = sorted;

    // Reveal next drawing
    if (this.gameState.revealIndex < this.gameState.submissions.length) {
      this.gameState.submissions[this.gameState.revealIndex].revealed = true;
      this.gameState.revealIndex++;

      // Reset guess timer when revealing a new drawing
      this.startGuessTimer();

      this.broadcastState();
    }
  }

  handleGuess(payload: GuessPayload, sender: Party.Connection) {
    if (this.gameState.phase !== 'revealing') return;
    if (sender.id !== this.gameState.currentGuesserId) return;
    if (!this.gameState.currentWord) return;

    this.gameState.guessHistory.push(payload.guess);

    if (isGuessCorrect(payload.guess, this.gameState.currentWord)) {
      // Correct guess!
      this.gameState.correctGuess = true;

      // Award points: 2 for drawer, 1 for guesser
      const guesser = this.gameState.players.find(
        (p) => p.id === this.gameState.currentGuesserId
      );
      if (guesser) {
        guesser.score += 1;
      }

      // Find the drawer whose drawing was just revealed
      const lastRevealedIndex = this.gameState.revealIndex - 1;
      if (lastRevealedIndex >= 0) {
        const submission = this.gameState.submissions[lastRevealedIndex];
        const drawer = this.gameState.players.find(
          (p) => p.id === submission.playerId
        );
        if (drawer) {
          drawer.score += 2;
        }
      }

      // End round
      this.gameState.phase = 'round_end';
    } else {
      // Wrong guess - reveal next drawing if available
      if (this.gameState.revealIndex < this.gameState.submissions.length) {
        this.handleRevealNext(sender);
      } else {
        // All drawings revealed, no correct guess
        this.gameState.phase = 'round_end';
      }
    }

    this.broadcastState();
  }

  handleNextRound(sender: Party.Connection) {
    const player = this.gameState.players.find((p) => p.id === sender.id);
    if (!player?.isHost) return;
    if (this.gameState.phase !== 'round_end') return;

    this.startNextRound();
  }

  startDrawingPhase() {
    // Reset round state
    this.gameState.phase = 'drawing';
    this.gameState.submissions = [];
    this.gameState.revealIndex = 0;
    this.gameState.correctGuess = false;
    this.gameState.guessHistory = [];

    // Reset player submission state
    this.gameState.players.forEach((p) => {
      p.hasSubmitted = false;
      p.objectCount = undefined;
    });

    // Pick a word based on difficulty
    const difficulty: Difficulty | undefined = this.gameState.difficulty === 'mixte'
      ? undefined
      : this.gameState.difficulty as Difficulty;
    const wordEntry = getRandomWord(this.usedWords, difficulty);
    if (wordEntry) {
      this.gameState.currentWord = wordEntry.word;
      this.gameState.currentWordCategory = wordEntry.category;
      this.usedWords.push(wordEntry.word);
    }

    // Set timer
    this.gameState.timerEndTime =
      Date.now() + this.gameState.timerDuration * 1000;

    // Start timer to auto-end drawing phase
    setTimeout(() => {
      if (this.gameState.phase === 'drawing') {
        this.startRevealPhase();
      }
    }, this.gameState.timerDuration * 1000);

    this.broadcastState();
  }

  startRevealPhase() {
    this.gameState.phase = 'revealing';
    this.gameState.timerEndTime = null;

    // Sort submissions by object count (ascending)
    this.gameState.submissions.sort((a, b) => a.objectCount - b.objectCount);

    // Automatically reveal the first drawing
    if (this.gameState.submissions.length > 0) {
      this.gameState.submissions[0].revealed = true;
      this.gameState.revealIndex = 1;
    }

    // Start 30s guess timer
    this.startGuessTimer();

    this.broadcastState();
  }

  startGuessTimer() {
    this.gameState.guessTimerEndTime = Date.now() + 30 * 1000;

    // Auto-end round when timer expires
    setTimeout(() => {
      if (
        this.gameState.phase === 'revealing' &&
        this.gameState.guessTimerEndTime &&
        Date.now() >= this.gameState.guessTimerEndTime
      ) {
        // Time's up, end round without correct guess
        this.gameState.phase = 'round_end';
        this.gameState.guessTimerEndTime = null;
        this.broadcastState();
      }
    }, 30 * 1000);
  }

  startNextRound() {
    this.gameState.roundNumber++;

    if (this.gameState.roundNumber > this.gameState.totalRounds) {
      // Game over
      this.gameState.phase = 'game_over';
      this.broadcastState();
      return;
    }

    // Next player becomes guesser
    const currentGuesserIndex = this.gameState.players.findIndex(
      (p) => p.id === this.gameState.currentGuesserId
    );
    const nextGuesserIndex =
      (currentGuesserIndex + 1) % this.gameState.players.length;
    this.gameState.currentGuesserId =
      this.gameState.players[nextGuesserIndex].id;

    this.startDrawingPhase();
  }

  broadcastState() {
    const message = JSON.stringify({
      type: 'sync_state',
      payload: this.gameState,
    });

    // Only hide word from guesser during drawing and revealing phases
    const shouldHideWord =
      this.gameState.phase === 'drawing' ||
      this.gameState.phase === 'revealing';

    // Send state to all connections
    for (const conn of this.room.getConnections()) {
      if (shouldHideWord && conn.id === this.gameState.currentGuesserId) {
        // Hide word from guesser during active game
        const guesserState = {
          ...this.gameState,
          currentWord: null,
        };
        conn.send(
          JSON.stringify({
            type: 'sync_state',
            payload: guesserState,
          })
        );
      } else {
        conn.send(message);
      }
    }
  }
}

CrokiServer satisfies Party.Worker;
