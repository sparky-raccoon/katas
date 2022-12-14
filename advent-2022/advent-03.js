import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-03.data');

const reMapAlphabeticValue = (value, min1, min2) => {
    const diff = value - min1;
    return min2 + diff;
}

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const backpacks = data.split('\n');
    const commonItems = [];

    for (let b = 0; b < backpacks.length; b++) {
        const backpack = backpacks[b];
        const getCompartimentArray = (compartiment) => {
            return compartiment.split('')
            .map(c => {
                const charCode = c.charCodeAt();
                // Uppercase (A-Z) : [ 65, 91 ] -> [ 27, 52 ]
                // Lowercase (a-z) : [ 97, 123 ] -> [ 1, 26 ]
                if (charCode >= 65 && charCode <= 91) return reMapAlphabeticValue(charCode, 65, 27);
                else return reMapAlphabeticValue(charCode, 97, 1);
            })
            .sort((a, b) => a - b);
        }

        const firstCompartiment = getCompartimentArray(backpack.slice(0, backpack.length / 2))
        const secondCompartiment = getCompartimentArray(backpack.slice(backpack.length / 2))

        let i = 0, j = 0;
        while (i <= firstCompartiment.length - 1 && j <= secondCompartiment.length - 1) {
            if (firstCompartiment[i] < secondCompartiment[j]) i++;
            else {
                if (firstCompartiment[i] > secondCompartiment[j]) j++;
                else {
                    commonItems.push(firstCompartiment[i]);
                    break;
                }
            }
        }
    }

    const result = commonItems.reduce((acc, current) => acc + current, 0);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

main();