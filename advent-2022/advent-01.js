import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-01.data');

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const addedCaloriesSorted = data
      .split('\n\n')
      .map(re => {
        return re.split('\n').reduce((acc, current) => {
          return acc + parseInt(current);
        }, 0)
      })
      .sort((a, b) => a - b)
      .reverse();
    const totalTopThree = addedCaloriesSorted
      .slice(0, 3)
      .reduce((acc, value) => {
        return acc + value;
      }, 0);

    console.log(totalTopThree);
  } catch (err) {
    console.log(err);
  }
}

main();