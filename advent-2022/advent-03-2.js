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

const getBackPackArray = (backpack) => {
    return backpack
        .split('')
        .map(c => {
            const charCode = c.charCodeAt();
            // Uppercase (A-Z) : [ 65, 91 ] -> [ 27, 52 ]
            // Lowercase (a-z) : [ 97, 123 ] -> [ 1, 26 ]
            if (charCode >= 65 && charCode <= 91) return reMapAlphabeticValue(charCode, 65, 27);
            else return reMapAlphabeticValue(charCode, 97, 1);
        })
        .sort((a, b) => a - b);
}

const findCommonItems = (array1, array2, breakAtFirstCommonItem = false) => {
    let commonItems = [];
    let i = 0, j = 0;
    while (i <= array1.length - 1 && j <= array2.length - 1) {
        if (array1[i] < array2[j]) i++;
        else {
            if (array1[i] > array2[j]) j++;
            else {
                commonItems.push(array1[i]);
                if (breakAtFirstCommonItem) break;
                else {
                    i++;
                    j++;
                }
            }
        }
    }
    return commonItems;
}

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const backpacks = data.split('\n');
    const commonItems = [];

    let elfIndexInGroup = 0;
    let group = [];
    for (let b = 0; b < backpacks.length; b++) {
        elfIndexInGroup++;
        const backpack = backpacks[b];
        group.push(getBackPackArray(backpack));

        if (elfIndexInGroup === 3) {
            const [ firstBackPack, secondBackPack, thirdBackPack ] = group;
            const commonItemsBetweenFirstAndSecond = findCommonItems(firstBackPack, secondBackPack);
            const commonItemBetweenAll = findCommonItems(commonItemsBetweenFirstAndSecond, thirdBackPack, true)[0];
            commonItems.push(commonItemBetweenAll);

            // Next elf belongs to another group.
            elfIndexInGroup = 0;
            group = [];
        }
    }

    const result = commonItems.reduce((acc, current) => acc + current, 0);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

main();