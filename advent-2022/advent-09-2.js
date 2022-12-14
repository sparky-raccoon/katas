import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-09.data');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move = direction => {
        switch(direction) {
            case 'U':
                this.y++;
                break;
            case 'D':
                this.y--;
                break;
            case 'R':
                this.x++;
                break;
            case 'L':
                this.x--;
                break;
        }
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
}

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const motions = data.split('\n');

        const knotsNumber = 10;
        const knots = [];
        for (let k = 0; k < knotsNumber; k++) knots.push(new Point(0, 0));
        
        const visitedPositions = [ [0, 0] ];
        for (let m = 0; m < motions.length; m++) {
            const [ direction, steps ] = motions[m].split(' ');
            for (let s = 0; s < parseInt(steps); s++) {
                for (let k = knotsNumber - 2; k >= 0; k--) {
                    const previousKnotIndex = k + 1;
                    const previousKnot = knots[previousKnotIndex];
                    const knot = knots[k];

                    if (previousKnotIndex === knotsNumber - 1) previousKnot.move(direction);
    
                    const previousKnotPosition = previousKnot.getPosition();
                    const knotPosition = knot.getPosition();
                    const dx = previousKnotPosition.x - knotPosition.x;
                    const dy = previousKnotPosition.y - knotPosition.y;
                    const knotShouldNotMove = (dx === 0 && dy === 0) ||
                        (dx === 0 && Math.abs(dy) === 1) ||
                        (Math.abs(dx) === 1 && Math.abs(dy) ===1) ||
                        (Math.abs(dx) === 1 && dy === 0);
        
                    if (!knotShouldNotMove) {
                        if (dx === -2) {
                            knot.move('L');
                            if (dy === -1) knot.move('D');
                            else if (dy === 1) knot.move('U');
                        } else if (dx === 2) {
                            knot.move('R');
                            if (dy === -1) knot.move('D');
                            else if (dy === 1) knot.move('U');
                        }
    
                        if (dy === -2) {
                            knot.move('D');
                            if (dx === -1) knot.move('L');
                            else if (dx === 1) knot.move('R');
                        } else if (dy === 2) {
                            knot.move('U');
                            if (dx === -1) knot.move('L');
                            else if (dx === 1) knot.move('R');
                        }
    
                        if (k === 0) {
                            const newTailPosition = knot.getPosition();
                            if (visitedPositions.findIndex(p => p[0] === newTailPosition.x && p[1] === newTailPosition.y) === -1) {
                                visitedPositions.push([newTailPosition.x, newTailPosition.y]);
                            }
                        }
                    }
                }
            }
        }

      console.log(visitedPositions.length);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 