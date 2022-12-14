import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-02.data');

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const rounds = data.split('\n');

    const shapeScores = { ROCK: 1, PAPER: 2, SCISSORS: 3 };
    const outcomeScores = { LOSE: 0, DRAW: 3, WIN: 6 };
    const decryptShape = encryptedShape => {
        if (encryptedShape === 'A' || encryptedShape === 'X') return 'ROCK';
        if (encryptedShape === 'B' || encryptedShape === 'Y') return 'PAPER';
        if (encryptedShape === 'C' || encryptedShape === 'Z') return 'SCISSORS';
    }

    const findOutcome = (shape, opponentShape) => {
        if (shape === opponentShape) return 'DRAW';

        if ((shape === 'ROCK' && opponentShape === 'SCISSORS') ||
            (shape === 'SCISSORS' && opponentShape === 'PAPER') || 
            (shape === 'PAPER' && opponentShape === 'ROCK')) {
            return 'WIN';
        }

        return 'LOSE';
    }

    const scoreRounds = rounds.map(r => {
        const [ opponentEncryptedShape, encryptedShape ] = r.split(' ');
        const opponentShape = decryptShape(opponentEncryptedShape);
        const shape = decryptShape(encryptedShape);
        const outcome = findOutcome(shape, opponentShape);
        console.log(opponentEncryptedShape, encryptedShape, ' : ', opponentShape, shape, ' : ', outcome);

        return outcomeScores[outcome] + shapeScores[shape];
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