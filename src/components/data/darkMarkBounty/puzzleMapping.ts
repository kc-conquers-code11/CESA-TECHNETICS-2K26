import { ENVELOPE_CODES, type EnvelopeCode } from "./envelopeCodes";
import { GAME_TYPES, PUZZLES } from "./index";

const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const shufflePuzzleContent = (puzzle: any): any => {
    if (!puzzle) return puzzle;

    // Deep clone
    const cloned = JSON.parse(JSON.stringify(puzzle));

    // Common arrays used across games that can be safely shuffled
    if (Array.isArray(cloned.options)) {
        cloned.options = shuffleArray(cloned.options);
    }

    if (Array.isArray(cloned.pairs)) {
        cloned.pairs = shuffleArray(cloned.pairs);
    }

    return cloned;
};

export const getPuzzleForCode = (code: EnvelopeCode) => {
    const envelope = ENVELOPE_CODES[code];
    if (!envelope) {
        throw new Error(`Invalid envelope code: ${code}`);
    }

    // Generate deterministic pseudo-random number based on the string code (e.g. DM101 -> 101)
    const numericPart = parseInt(code.replace(/\D/g, ""), 10) || 0;

    // Pick a stable game type based on the code's numeric part
    const gameType = GAME_TYPES[numericPart % GAME_TYPES.length];

    const puzzlesForGame = PUZZLES[gameType];
    let difficultyPuzzles =
        puzzlesForGame[envelope.difficulty as keyof typeof puzzlesForGame];

    // Fallback to easy if this game type doesn't have the required difficulty
    if (
        !difficultyPuzzles ||
        (Array.isArray(difficultyPuzzles) && difficultyPuzzles.length === 0)
    ) {
        difficultyPuzzles = (puzzlesForGame as any).easy;
    }

    const puzzleArray = difficultyPuzzles as unknown as any[];

    // Pick stable puzzle index based on string characters sum
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        hash += code.charCodeAt(i);
    }

    const puzzleIndex = hash % puzzleArray.length;
    const originalPuzzle = puzzleArray[puzzleIndex];

    return {
        gameType,
        puzzle: shufflePuzzleContent(originalPuzzle),
    };
};
