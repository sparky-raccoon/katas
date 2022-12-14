import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-04.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const pairs = data.split('\n');

        const getRangeValues = elf => {
            return elf
                .split('-')
                .map(v => parseInt(v));
        }

        let count = 0;
        for (let p = 0; p < pairs.length; p++) {
            const [ firstElf, secondElf ] = pairs[p].split(',');

            const [ min1, max1 ] = getRangeValues(firstElf);
            const [ min2, max2 ] = getRangeValues(secondElf);

            // First Part
            /* if ((min1 <= min2 && max1 >= max2) || (min2 <= min1 && max2 >= max1)) {
                count++;
            } */

            // Second Part
            if (((min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2)) ||
                ((min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1))) {
                count++;
            }
        }

        console.log(count);
    } catch (err) {
      console.log(err);
    }
}
  
main();