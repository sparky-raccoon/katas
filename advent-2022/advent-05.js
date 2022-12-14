import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-05.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const [ stackData, instructionsData ] = data.split('\n\n');
        const stacks = {};
        stackData
            .split('\n')
            .forEach((stackLine, i, currentArray) => {
                if (i !== currentArray.length - 1) {
                    const splittedStackLine = stackLine.split(' ');
                    let stackIndex = -1;
                    for (let c = 0; c < splittedStackLine.length; c++) {
                        stackIndex++;
                        if (splittedStackLine[c] === '') {
                            c+= 3;
                        } else {
                            const letter = splittedStackLine[c].match(/\[(\w)\]/)[1];
                            if (stacks[stackIndex]) stacks[stackIndex].unshift(letter);
                            else stacks[stackIndex] = [letter];
                        }
                    }
                }
            })

        instructionsData.split('\n').forEach(instructionLine => {
            const [ nbOfCratesToMove, origin, destination ] = instructionLine
                .split(' ')
                .map(w => parseInt(w))
                .filter(w => !isNaN(w));

            // First Part
            /* for (let n = 0; n < nbOfCratesToMove; n++) {
                stacks[destination - 1].push(stacks[origin - 1].pop());
            } */

            // Second Part
            const originStack = stacks[origin - 1];
            const destinationStack = stacks[destination - 1];
            const movedCrates = originStack.splice(originStack.length - nbOfCratesToMove, nbOfCratesToMove);
            stacks[destination - 1] = destinationStack.concat(movedCrates);
        })

        let res = '';
        for (let s = 0; s < Object.keys(stacks).length; s++) {
            res += stacks[s][stacks[s].length - 1]; 
        }
        console.log(res);
    } catch (err) {
      console.log(err);
    }
}
  
main();