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
        
        const head = new Point(0, 0);
        const tail = new Point(0, 0);
        const visitedPositions = [ [0, 0] ];

        for (let m = 0; m < motions.length; m++) {
            // Update head position regarding motion.
            const [ direction, steps ] = motions[m].split(' ');
            console.log(direction, steps);
            console.log('BEFORE', 'head', head.getPosition(), 'tail', tail.getPosition());
            for (let s = 0; s < parseInt(steps); s++) {
                head.move(direction);
    
                const tailPosition = tail.getPosition();
                const headPosition = head.getPosition();
    
                // Check tail position regarding last head position.
                const dx = headPosition.x - tailPosition.x;
                const dy = headPosition.y - tailPosition.y;
                const tailShouldNotMove = (dx === 0 && dy === 0) ||
                    (dx === 0 && Math.abs(dy) === 1) ||
                    (Math.abs(dx) === 1 && Math.abs(dy) ===1) ||
                    (Math.abs(dx) === 1 && dy === 0);
    
                if (!tailShouldNotMove) {
                    if (dx === -2) {
                        tail.move('L');
                        if (dy === -1) tail.move('D');
                        else if (dy === 1) tail.move('U');
                    } else if (dx === 2) {
                        tail.move('R');
                        if (dy === -1) tail.move('D');
                        else if (dy === 1) tail.move('U');
                    }

                    if (dy === -2) {
                        tail.move('D');
                        if (dx === -1) tail.move('L');
                        else if (dx === 1) tail.move('R');
                    } else if (dy === 2) {
                        tail.move('U');
                        if (dx === -1) tail.move('L');
                        else if (dx === 1) tail.move('R');
                    }
    
                    const newTailPosition = tail.getPosition();
                    console.log('>', newTailPosition);
                    // If tailPosition is not included in visitedPositions, update this array.
                    if (visitedPositions.findIndex(p => p[0] === newTailPosition.x && p[1] === newTailPosition.y) === -1) {
                        visitedPositions.push([newTailPosition.x, newTailPosition.y]);
                    }
                }
            }
            console.log('AFTER', 'head', head.getPosition(), 'tail', tail.getPosition());
            console.log('\n');
        }

        console.log(visitedPositions.length);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 