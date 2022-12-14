import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-02.data');

const SHAPES = {
  A: 'ROCK',
  B: 'PAPER',
  C: 'SCISSORS',
}

const OUTCOMES = {
  X: 'LOSE',
  Y: 'DRAW',
  Z: 'WIN',
}

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const rounds = data.split('\n');

    const shapeScores = { ROCK: 1, PAPER: 2, SCISSORS: 3 };
    const outcomeScores = { LOSE: 0, DRAW: 3, WIN: 6 };

    const findShape = (opponentShape, desiredOutcome) => {
      if (desiredOutcome === 'DRAW') return opponentShape;

      if (opponentShape === 'ROCK') {
        if (desiredOutcome === 'WIN') return 'PAPER';
        else return 'SCISSORS';
      } else if (opponentShape === 'SCISSORS') {
        if (desiredOutcome === 'WIN') return 'ROCK';
        else return 'PAPER';
      } else if (opponentShape === 'PAPER') {
        if (desiredOutcome === 'WIN') return 'SCISSORS';
        else return 'ROCK';
      }
    }

    const scoreRounds = rounds.map(r => {
        const [ encryptedOpponentShape, encryptedDesiredOutcome ] = r.split(' ');
        const opponentShape = SHAPES[encryptedOpponentShape];
        const desiredOutcome = OUTCOMES[encryptedDesiredOutcome];
        const shape = findShape(opponentShape, desiredOutcome);
        
        console.log(opponentShape, desiredOutcome, shape);

        return outcomeScores[desiredOutcome] + shapeScores[shape];
    })

    const totalScore = scoreRounds.reduce((acc, value) => {
        return acc + value;
    }, 0)

    console.log(totalScore);
    
  } catch (err) {
    console.log(err);
  }
}

main();