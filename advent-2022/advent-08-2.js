import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-08.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const treesMapArray = data.split('\n');
        const trees = treesMapArray.join('');
        const mapWidth = treesMapArray[0].length;
        const mapHeight = treesMapArray.length;

        const getCol = index => index % mapWidth;
        const getRow = index => Math.floor(index / mapWidth);

        const getViewingDistanceAtDir = (direction, treeInfo) => {
            const {
                index: treeIndex,
                mapPosition: { row: treeRow },
                height: treeHeight,
            } = treeInfo;

            let viewingDistance = 0;
            let cursor, edgeCondition;
            switch (direction) {
                case 'top': {
                    cursor = index => index - mapWidth;
                    edgeCondition = index => getRow(index) >= 0;
                    break;
                }
                case 'left': {
                    cursor = index => index - 1;
                    edgeCondition = index => getCol(index) >= 0 && (getRow(index) === treeRow);
                    break;
                }
                case 'right': {
                    cursor = index => index + 1;
                    edgeCondition = index => (getCol(index) < mapWidth) && (getRow(index) === treeRow);
                    break;
                }
                case 'bottom': {
                    cursor = index => index + mapWidth;
                    edgeCondition = index => getRow(index) < mapHeight;
                    break;
                }
            }

            for (let st = cursor(treeIndex); edgeCondition(st) ; st = cursor(st)) {
                viewingDistance++;
                if (parseInt(trees[st]) >= treeHeight) break;
            }

            return viewingDistance;
        }

        let highestScenicScore = 0;
        for (let t = 0; t < trees.length; t++) {
            const col = t % mapWidth;
            const row = Math.floor(t / mapWidth);

            const directions = [ 'top', 'right', 'bottom', 'left' ];
            const treeInfo = {
                index: t,
                mapPosition: { col, row },
                height: parseInt(trees[t]),
            };


            const viewingDistances = [];
            for (let d = 0; d < directions.length; d++) viewingDistances.push(getViewingDistanceAtDir(directions[d], treeInfo));
            const scenicScore = viewingDistances.reduce((acc, value) => acc * value, 1);
            if (scenicScore > highestScenicScore) highestScenicScore = scenicScore;
        }

        console.log(highestScenicScore);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 