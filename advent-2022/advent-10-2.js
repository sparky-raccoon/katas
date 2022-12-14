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
        const crtW = 40;
        const crtH = 6;
        const spriteW = 3;

        let X = 1;
        let cycleIndex = 0;

        const pixelRows = [];
        let pixelRow = '';
        let pixelColumnIndex = 0;
        const completeCycle = () => {
            cycleIndex++;

            if (pixelColumnIndex >= X - 1 && pixelColumnIndex <= X + 1) pixelRow+='#';
            else pixelRow+='.';

            if (pixelColumnIndex === crtW - 1) {
                pixelRows.push(pixelRow);
                pixelRow = '';
                pixelColumnIndex = 0;
            } else pixelColumnIndex++;
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

        console.log(pixelRows);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 