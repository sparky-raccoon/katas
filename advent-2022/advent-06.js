import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-06.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        console.log(data);
        let isMarkerDetected = false;
        let i = 14;
        while (!isMarkerDetected) {
            const slice = data.slice(i - 14, i);
            const reducedSlice = [... new Set(slice)];
            if (slice.length === reducedSlice.length) {
                isMarkerDetected = true;
            } else i++;
        }
        console.log(i);
    } catch (err) {
      console.log(err);
    }
}
  
main();