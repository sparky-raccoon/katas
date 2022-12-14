import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-10.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const instructions = data.split('\n');

        let X = 1;
        let cycleIndex = 0;

        let relevantCycleIndex = 20;
        const relevantCycles = [];
        const completeCycle = () => {
            cycleIndex++;

            if (cycleIndex === relevantCycleIndex) {
                relevantCycles.push(cycleIndex*X);
                relevantCycleIndex+=40;
            }
        }

        for (let i = 0; i < instructions.length; i++) {
            const [ type, value ] = instructions[i].split(' ');
            if (type === 'noop') completeCycle();
            else {
                completeCycle();
                completeCycle();
                X+=parseInt(value);
            }
        }

        const sum = relevantCycles.reduce((acc, value) => acc + value, 0);
        console.log(sum);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 