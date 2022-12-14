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

        const checkVisibilityRegardingSurroundingTrees = (direction, treeInfo) => {
            const {
                index: treeIndex,
                mapPosition: { col: treeCol, row: treeRow },
                height: treeHeight,
            } = treeInfo;

            let isVisible = true;
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
                if (parseInt(trees[st]) >= treeHeight) {
                    isVisible = false;
                    break;
                }
            }

            return isVisible;
        }

        let visibleTrees = 0;
        for (let t = 0; t < trees.length; t++) {
            const col = t % mapWidth;
            const row = Math.floor(t / mapWidth);

            if (col === 0 || col === mapWidth - 1 || row === 0 || row === mapHeight - 1) visibleTrees++;
            else {
                const directions = [ 'top', 'right', 'bottom', 'left' ];
                const treeInfo = {
                    index: t,
                    mapPosition: { col, row },
                    height: parseInt(trees[t]),
                };

                let isVisible = false;
                if (treeInfo.height !== 0) {
                    for (let d = 0; d < directions.length; d++) {
                        isVisible = checkVisibilityRegardingSurroundingTrees(directions[d], treeInfo);
                        if (isVisible) break;
                    }
    
                    if (isVisible) visibleTrees++
                }
            }
        }

        console.log(visibleTrees);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 