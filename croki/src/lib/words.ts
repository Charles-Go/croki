export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface WordEntry {
  word: string;
  category: string;
  difficulty: Difficulty;
}

// French word list for the game
export const words: WordEntry[] = [
  // ===== FACILE (Easy) - Simple objects, common animals =====

  // Animaux faciles
  { word: 'chat', category: 'animal', difficulty: 'facile' },
  { word: 'chien', category: 'animal', difficulty: 'facile' },
  { word: 'oiseau', category: 'animal', difficulty: 'facile' },
  { word: 'poisson', category: 'animal', difficulty: 'facile' },
  { word: 'lapin', category: 'animal', difficulty: 'facile' },
  { word: 'cochon', category: 'animal', difficulty: 'facile' },
  { word: 'vache', category: 'animal', difficulty: 'facile' },
  { word: 'souris', category: 'animal', difficulty: 'facile' },
  { word: 'canard', category: 'animal', difficulty: 'facile' },
  { word: 'poule', category: 'animal', difficulty: 'facile' },
  { word: 'mouton', category: 'animal', difficulty: 'facile' },
  { word: 'abeille', category: 'animal', difficulty: 'facile' },

  // Objets faciles
  { word: 'maison', category: 'objet', difficulty: 'facile' },
  { word: 'voiture', category: 'objet', difficulty: 'facile' },
  { word: 'vélo', category: 'objet', difficulty: 'facile' },
  { word: 'ballon', category: 'objet', difficulty: 'facile' },
  { word: 'livre', category: 'objet', difficulty: 'facile' },
  { word: 'chaise', category: 'objet', difficulty: 'facile' },
  { word: 'table', category: 'objet', difficulty: 'facile' },
  { word: 'lit', category: 'objet', difficulty: 'facile' },
  { word: 'porte', category: 'objet', difficulty: 'facile' },
  { word: 'fenêtre', category: 'objet', difficulty: 'facile' },
  { word: 'clé', category: 'objet', difficulty: 'facile' },
  { word: 'télévision', category: 'objet', difficulty: 'facile' },
  { word: 'lampe', category: 'objet', difficulty: 'facile' },
  { word: 'bougie', category: 'objet', difficulty: 'facile' },
  { word: 'parapluie', category: 'objet', difficulty: 'facile' },
  { word: 'chapeau', category: 'objet', difficulty: 'facile' },
  { word: 'lunettes', category: 'objet', difficulty: 'facile' },
  { word: 'montre', category: 'objet', difficulty: 'facile' },
  { word: 'crayon', category: 'objet', difficulty: 'facile' },
  { word: 'ciseaux', category: 'objet', difficulty: 'facile' },
  { word: 'échelle', category: 'objet', difficulty: 'facile' },
  { word: 'miroir', category: 'objet', difficulty: 'facile' },
  { word: 'sac', category: 'objet', difficulty: 'facile' },

  // Nature facile
  { word: 'soleil', category: 'nature', difficulty: 'facile' },
  { word: 'lune', category: 'nature', difficulty: 'facile' },
  { word: 'étoile', category: 'nature', difficulty: 'facile' },
  { word: 'nuage', category: 'nature', difficulty: 'facile' },
  { word: 'arbre', category: 'nature', difficulty: 'facile' },
  { word: 'fleur', category: 'nature', difficulty: 'facile' },
  { word: 'montagne', category: 'nature', difficulty: 'facile' },
  { word: 'neige', category: 'nature', difficulty: 'facile' },
  { word: 'pluie', category: 'nature', difficulty: 'facile' },
  { word: 'arc-en-ciel', category: 'nature', difficulty: 'facile' },
  { word: 'feu', category: 'nature', difficulty: 'facile' },

  // Nourriture facile
  { word: 'pizza', category: 'nourriture', difficulty: 'facile' },
  { word: 'pomme', category: 'nourriture', difficulty: 'facile' },
  { word: 'banane', category: 'nourriture', difficulty: 'facile' },
  { word: 'gâteau', category: 'nourriture', difficulty: 'facile' },
  { word: 'glace', category: 'nourriture', difficulty: 'facile' },
  { word: 'pain', category: 'nourriture', difficulty: 'facile' },
  { word: 'fromage', category: 'nourriture', difficulty: 'facile' },
  { word: 'œuf', category: 'nourriture', difficulty: 'facile' },
  { word: 'bonbon', category: 'nourriture', difficulty: 'facile' },
  { word: 'carotte', category: 'nourriture', difficulty: 'facile' },
  { word: 'orange', category: 'nourriture', difficulty: 'facile' },
  { word: 'fraise', category: 'nourriture', difficulty: 'facile' },

  // Corps facile
  { word: 'œil', category: 'corps', difficulty: 'facile' },
  { word: 'main', category: 'corps', difficulty: 'facile' },
  { word: 'pied', category: 'corps', difficulty: 'facile' },
  { word: 'cœur', category: 'corps', difficulty: 'facile' },
  { word: 'dent', category: 'corps', difficulty: 'facile' },

  // ===== MOYEN (Medium) - More complex objects, actions =====

  // Animaux moyens
  { word: 'éléphant', category: 'animal', difficulty: 'moyen' },
  { word: 'lion', category: 'animal', difficulty: 'moyen' },
  { word: 'serpent', category: 'animal', difficulty: 'moyen' },
  { word: 'tortue', category: 'animal', difficulty: 'moyen' },
  { word: 'grenouille', category: 'animal', difficulty: 'moyen' },
  { word: 'cheval', category: 'animal', difficulty: 'moyen' },
  { word: 'papillon', category: 'animal', difficulty: 'moyen' },
  { word: 'araignée', category: 'animal', difficulty: 'moyen' },
  { word: 'dauphin', category: 'animal', difficulty: 'moyen' },
  { word: 'requin', category: 'animal', difficulty: 'moyen' },
  { word: 'crocodile', category: 'animal', difficulty: 'moyen' },
  { word: 'singe', category: 'animal', difficulty: 'moyen' },
  { word: 'girafe', category: 'animal', difficulty: 'moyen' },
  { word: 'hibou', category: 'animal', difficulty: 'moyen' },
  { word: 'escargot', category: 'animal', difficulty: 'moyen' },
  { word: 'pingouin', category: 'animal', difficulty: 'moyen' },
  { word: 'baleine', category: 'animal', difficulty: 'moyen' },
  { word: 'méduse', category: 'animal', difficulty: 'moyen' },
  { word: 'crabe', category: 'animal', difficulty: 'moyen' },
  { word: 'fourmi', category: 'animal', difficulty: 'moyen' },

  // Objets moyens
  { word: 'avion', category: 'objet', difficulty: 'moyen' },
  { word: 'bateau', category: 'objet', difficulty: 'moyen' },
  { word: 'téléphone', category: 'objet', difficulty: 'moyen' },
  { word: 'ordinateur', category: 'objet', difficulty: 'moyen' },
  { word: 'horloge', category: 'objet', difficulty: 'moyen' },
  { word: 'guitare', category: 'objet', difficulty: 'moyen' },
  { word: 'piano', category: 'objet', difficulty: 'moyen' },
  { word: 'tambour', category: 'objet', difficulty: 'moyen' },
  { word: 'violon', category: 'objet', difficulty: 'moyen' },
  { word: 'caméra', category: 'objet', difficulty: 'moyen' },
  { word: 'robot', category: 'objet', difficulty: 'moyen' },
  { word: 'fusée', category: 'objet', difficulty: 'moyen' },
  { word: 'hélicoptère', category: 'objet', difficulty: 'moyen' },
  { word: 'train', category: 'objet', difficulty: 'moyen' },
  { word: 'moto', category: 'objet', difficulty: 'moyen' },
  { word: 'tracteur', category: 'objet', difficulty: 'moyen' },
  { word: 'couronne', category: 'objet', difficulty: 'moyen' },
  { word: 'épée', category: 'objet', difficulty: 'moyen' },
  { word: 'bouclier', category: 'objet', difficulty: 'moyen' },
  { word: 'arc', category: 'objet', difficulty: 'moyen' },
  { word: 'ancre', category: 'objet', difficulty: 'moyen' },
  { word: 'boussole', category: 'objet', difficulty: 'moyen' },
  { word: 'microscope', category: 'objet', difficulty: 'moyen' },
  { word: 'télescope', category: 'objet', difficulty: 'moyen' },
  { word: 'parachute', category: 'objet', difficulty: 'moyen' },
  { word: 'skateboard', category: 'objet', difficulty: 'moyen' },
  { word: 'trottinette', category: 'objet', difficulty: 'moyen' },

  // Nature moyenne
  { word: 'rivière', category: 'nature', difficulty: 'moyen' },
  { word: 'océan', category: 'nature', difficulty: 'moyen' },
  { word: 'forêt', category: 'nature', difficulty: 'moyen' },
  { word: 'plage', category: 'nature', difficulty: 'moyen' },
  { word: 'volcan', category: 'nature', difficulty: 'moyen' },
  { word: 'cascade', category: 'nature', difficulty: 'moyen' },
  { word: 'île', category: 'nature', difficulty: 'moyen' },
  { word: 'désert', category: 'nature', difficulty: 'moyen' },
  { word: 'éclair', category: 'nature', difficulty: 'moyen' },
  { word: 'tornade', category: 'nature', difficulty: 'moyen' },
  { word: 'cactus', category: 'nature', difficulty: 'moyen' },
  { word: 'champignon', category: 'nature', difficulty: 'moyen' },
  { word: 'palmier', category: 'nature', difficulty: 'moyen' },

  // Nourriture moyenne
  { word: 'croissant', category: 'nourriture', difficulty: 'moyen' },
  { word: 'baguette', category: 'nourriture', difficulty: 'moyen' },
  { word: 'chocolat', category: 'nourriture', difficulty: 'moyen' },
  { word: 'hamburger', category: 'nourriture', difficulty: 'moyen' },
  { word: 'spaghetti', category: 'nourriture', difficulty: 'moyen' },
  { word: 'sushi', category: 'nourriture', difficulty: 'moyen' },
  { word: 'popcorn', category: 'nourriture', difficulty: 'moyen' },
  { word: 'crêpe', category: 'nourriture', difficulty: 'moyen' },
  { word: 'sandwich', category: 'nourriture', difficulty: 'moyen' },
  { word: 'soupe', category: 'nourriture', difficulty: 'moyen' },
  { word: 'salade', category: 'nourriture', difficulty: 'moyen' },
  { word: 'café', category: 'nourriture', difficulty: 'moyen' },
  { word: 'thé', category: 'nourriture', difficulty: 'moyen' },
  { word: 'vin', category: 'nourriture', difficulty: 'moyen' },
  { word: 'bière', category: 'nourriture', difficulty: 'moyen' },
  { word: 'pastèque', category: 'nourriture', difficulty: 'moyen' },
  { word: 'ananas', category: 'nourriture', difficulty: 'moyen' },
  { word: 'raisin', category: 'nourriture', difficulty: 'moyen' },
  { word: 'cerise', category: 'nourriture', difficulty: 'moyen' },
  { word: 'citron', category: 'nourriture', difficulty: 'moyen' },

  // Personnages moyens
  { word: 'pirate', category: 'personnage', difficulty: 'moyen' },
  { word: 'clown', category: 'personnage', difficulty: 'moyen' },
  { word: 'sorcière', category: 'personnage', difficulty: 'moyen' },
  { word: 'fantôme', category: 'personnage', difficulty: 'moyen' },
  { word: 'roi', category: 'personnage', difficulty: 'moyen' },
  { word: 'reine', category: 'personnage', difficulty: 'moyen' },
  { word: 'chevalier', category: 'personnage', difficulty: 'moyen' },
  { word: 'princesse', category: 'personnage', difficulty: 'moyen' },
  { word: 'ninja', category: 'personnage', difficulty: 'moyen' },
  { word: 'vampire', category: 'personnage', difficulty: 'moyen' },
  { word: 'momie', category: 'personnage', difficulty: 'moyen' },
  { word: 'zombie', category: 'personnage', difficulty: 'moyen' },
  { word: 'sirène', category: 'personnage', difficulty: 'moyen' },
  { word: 'fée', category: 'personnage', difficulty: 'moyen' },
  { word: 'dragon', category: 'personnage', difficulty: 'moyen' },
  { word: 'licorne', category: 'personnage', difficulty: 'moyen' },
  { word: 'extraterrestre', category: 'personnage', difficulty: 'moyen' },
  { word: 'astronaute', category: 'personnage', difficulty: 'moyen' },
  { word: 'pompier', category: 'personnage', difficulty: 'moyen' },
  { word: 'policier', category: 'personnage', difficulty: 'moyen' },
  { word: 'médecin', category: 'personnage', difficulty: 'moyen' },
  { word: 'cuisinier', category: 'personnage', difficulty: 'moyen' },

  // Lieux moyens
  { word: 'château', category: 'lieu', difficulty: 'moyen' },
  { word: 'église', category: 'lieu', difficulty: 'moyen' },
  { word: 'pyramide', category: 'lieu', difficulty: 'moyen' },
  { word: 'phare', category: 'lieu', difficulty: 'moyen' },
  { word: 'pont', category: 'lieu', difficulty: 'moyen' },
  { word: 'école', category: 'lieu', difficulty: 'moyen' },
  { word: 'hôpital', category: 'lieu', difficulty: 'moyen' },
  { word: 'cinéma', category: 'lieu', difficulty: 'moyen' },
  { word: 'restaurant', category: 'lieu', difficulty: 'moyen' },
  { word: 'prison', category: 'lieu', difficulty: 'moyen' },
  { word: 'stade', category: 'lieu', difficulty: 'moyen' },
  { word: 'cirque', category: 'lieu', difficulty: 'moyen' },
  { word: 'zoo', category: 'lieu', difficulty: 'moyen' },
  { word: 'ferme', category: 'lieu', difficulty: 'moyen' },
  { word: 'usine', category: 'lieu', difficulty: 'moyen' },

  // Sports et activités moyens
  { word: 'football', category: 'sport', difficulty: 'moyen' },
  { word: 'basketball', category: 'sport', difficulty: 'moyen' },
  { word: 'tennis', category: 'sport', difficulty: 'moyen' },
  { word: 'natation', category: 'sport', difficulty: 'moyen' },
  { word: 'ski', category: 'sport', difficulty: 'moyen' },
  { word: 'surf', category: 'sport', difficulty: 'moyen' },
  { word: 'boxe', category: 'sport', difficulty: 'moyen' },
  { word: 'golf', category: 'sport', difficulty: 'moyen' },
  { word: 'pêche', category: 'activité', difficulty: 'moyen' },
  { word: 'camping', category: 'activité', difficulty: 'moyen' },
  { word: 'jardinage', category: 'activité', difficulty: 'moyen' },
  { word: 'yoga', category: 'activité', difficulty: 'moyen' },

  // ===== DIFFICILE (Hard) - Abstract concepts, actions, complex ideas =====

  // Actions difficiles
  { word: 'rêver', category: 'action', difficulty: 'difficile' },
  { word: 'pleurer', category: 'action', difficulty: 'difficile' },
  { word: 'rire', category: 'action', difficulty: 'difficile' },
  { word: 'danser', category: 'action', difficulty: 'difficile' },
  { word: 'voler', category: 'action', difficulty: 'difficile' },
  { word: 'nager', category: 'action', difficulty: 'difficile' },
  { word: 'tomber', category: 'action', difficulty: 'difficile' },
  { word: 'sauter', category: 'action', difficulty: 'difficile' },
  { word: 'courir', category: 'action', difficulty: 'difficile' },
  { word: 'dormir', category: 'action', difficulty: 'difficile' },
  { word: 'manger', category: 'action', difficulty: 'difficile' },
  { word: 'cuisiner', category: 'action', difficulty: 'difficile' },
  { word: 'chanter', category: 'action', difficulty: 'difficile' },
  { word: 'penser', category: 'action', difficulty: 'difficile' },
  { word: 'écouter', category: 'action', difficulty: 'difficile' },
  { word: 'attendre', category: 'action', difficulty: 'difficile' },
  { word: 'chercher', category: 'action', difficulty: 'difficile' },
  { word: 'voyager', category: 'action', difficulty: 'difficile' },
  { word: 'escalader', category: 'action', difficulty: 'difficile' },
  { word: 'plonger', category: 'action', difficulty: 'difficile' },

  // Concepts difficiles
  { word: 'amour', category: 'concept', difficulty: 'difficile' },
  { word: 'liberté', category: 'concept', difficulty: 'difficile' },
  { word: 'paix', category: 'concept', difficulty: 'difficile' },
  { word: 'guerre', category: 'concept', difficulty: 'difficile' },
  { word: 'temps', category: 'concept', difficulty: 'difficile' },
  { word: 'musique', category: 'concept', difficulty: 'difficile' },
  { word: 'silence', category: 'concept', difficulty: 'difficile' },
  { word: 'froid', category: 'concept', difficulty: 'difficile' },
  { word: 'chaud', category: 'concept', difficulty: 'difficile' },
  { word: 'vitesse', category: 'concept', difficulty: 'difficile' },
  { word: 'gravité', category: 'concept', difficulty: 'difficile' },
  { word: 'magie', category: 'concept', difficulty: 'difficile' },
  { word: 'chance', category: 'concept', difficulty: 'difficile' },
  { word: 'surprise', category: 'concept', difficulty: 'difficile' },
  { word: 'peur', category: 'concept', difficulty: 'difficile' },
  { word: 'colère', category: 'concept', difficulty: 'difficile' },
  { word: 'joie', category: 'concept', difficulty: 'difficile' },
  { word: 'tristesse', category: 'concept', difficulty: 'difficile' },
  { word: 'faim', category: 'concept', difficulty: 'difficile' },
  { word: 'soif', category: 'concept', difficulty: 'difficile' },
  { word: 'fatigue', category: 'concept', difficulty: 'difficile' },
  { word: 'douleur', category: 'concept', difficulty: 'difficile' },
  { word: 'cauchemar', category: 'concept', difficulty: 'difficile' },
  { word: 'nostalgie', category: 'concept', difficulty: 'difficile' },

  // Événements difficiles
  { word: 'anniversaire', category: 'événement', difficulty: 'difficile' },
  { word: 'mariage', category: 'événement', difficulty: 'difficile' },
  { word: 'vacances', category: 'événement', difficulty: 'difficile' },
  { word: 'carnaval', category: 'événement', difficulty: 'difficile' },
  { word: 'concert', category: 'événement', difficulty: 'difficile' },
  { word: 'fête', category: 'événement', difficulty: 'difficile' },
  { word: 'révolution', category: 'événement', difficulty: 'difficile' },
  { word: 'apocalypse', category: 'événement', difficulty: 'difficile' },

  // Expressions et autres difficiles
  { word: 'déjà-vu', category: 'expression', difficulty: 'difficile' },
  { word: 'selfie', category: 'expression', difficulty: 'difficile' },
  { word: 'hashtag', category: 'expression', difficulty: 'difficile' },
  { word: 'wifi', category: 'technologie', difficulty: 'difficile' },
  { word: 'emoji', category: 'technologie', difficulty: 'difficile' },
  { word: 'bitcoin', category: 'technologie', difficulty: 'difficile' },
  { word: 'podcast', category: 'technologie', difficulty: 'difficile' },
  { word: 'streaming', category: 'technologie', difficulty: 'difficile' },

  // Animaux difficiles (à dessiner ou deviner)
  { word: 'caméléon', category: 'animal', difficulty: 'difficile' },
  { word: 'ornithorynque', category: 'animal', difficulty: 'difficile' },
  { word: 'axolotl', category: 'animal', difficulty: 'difficile' },
  { word: 'paresseux', category: 'animal', difficulty: 'difficile' },
  { word: 'panda', category: 'animal', difficulty: 'difficile' },
  { word: 'koala', category: 'animal', difficulty: 'difficile' },
  { word: 'kangourou', category: 'animal', difficulty: 'difficile' },
  { word: 'flamant', category: 'animal', difficulty: 'difficile' },
  { word: 'pieuvre', category: 'animal', difficulty: 'difficile' },
  { word: 'scorpion', category: 'animal', difficulty: 'difficile' },

  // Objets difficiles
  { word: 'sablier', category: 'objet', difficulty: 'difficile' },
  { word: 'trampoline', category: 'objet', difficulty: 'difficile' },
  { word: 'kaléidoscope', category: 'objet', difficulty: 'difficile' },
  { word: 'boomerang', category: 'objet', difficulty: 'difficile' },
  { word: 'yoyo', category: 'objet', difficulty: 'difficile' },
  { word: 'toboggan', category: 'objet', difficulty: 'difficile' },
  { word: 'balançoire', category: 'objet', difficulty: 'difficile' },
  { word: 'manège', category: 'objet', difficulty: 'difficile' },
  { word: 'aquarium', category: 'objet', difficulty: 'difficile' },
  { word: 'fontaine', category: 'objet', difficulty: 'difficile' },
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get a random word that hasn't been used yet
export function getRandomWord(usedWords: string[], difficulty?: Difficulty): WordEntry | null {
  let available = words.filter((w) => !usedWords.includes(w.word));

  if (difficulty) {
    available = available.filter((w) => w.difficulty === difficulty);
  }

  if (available.length === 0) return null;
  const shuffled = shuffleArray(available);
  return shuffled[0];
}
