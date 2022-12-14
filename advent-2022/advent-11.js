import fs from 'fs/promises';
import path from 'path';
import { start } from 'repl';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'advent-11.data');

const main = async () => {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const monkeyBlockInstructions = data.split('\n\n');
        const rounds = 1;

        const monkeys = [];
        for (let mbi = 0; mbi < monkeyBlockInstructions.length; mbi++) {
            const [, startingItemsString, operationString, ...testArray ] = monkeyBlockInstructions[mbi].split('\n');
            const startingItems = startingItemsString.split(': ')[1].split(', ').map(i => parseInt(i));
            const [, ...operationArray] = operationString.split('= ')[1].split(' ').map((o, i) => (i === 2 && o !== 'old') ? parseInt(o) : o);
            const test = testArray.map(t => {
                const splittedTest = t.split(' ');
                return parseInt(splittedTest[splittedTest.length - 1]);
            })

            monkeys.push({
                index: mbi,
                items: startingItems,
                operation: operationArray,
                test,
                inspectTimes: 0,
            })
        }

        const getWorryLevel = (operator, inspectedItem, operand) => {
            const finalOperand = (operand, inspectedItem) => operand === 'old' ? inspectedItem : operand;
            if (operator === '*') return inspectedItem * finalOperand(operand, inspectedItem);
            else return inspectedItem + finalOperand(operand, inspectedItem);
        }
        
        for (let r = 0; r < rounds; r++) {
            for (let m = 0; m < monkeys.length; m++) {
                const { items, operation, test } = monkeys[m];
                const [ operator, operand ] = operation;
                const [ divisibilityOperand, successMonkey, failMonkey ] = test;

                for (let i = 0; i < items.length; i++) {
                    const inspectedItem = items[i];
                    const worryLevel = getWorryLevel(operator, inspectedItem, operand);
                    const dividedWorryLevel = Math.floor(worryLevel / 3);
                    
                    if (dividedWorryLevel%divisibilityOperand === 0) monkeys[successMonkey].items.push(dividedWorryLevel);
                    else monkeys[failMonkey].items.push(dividedWorryLevel)

                    monkeys[m].inspectTimes++;
                }

                monkeys[m].items = [];
            }
        }

        console.log(monkeys);
        const monkeyBusiness = monkeys
            .sort((ma, mb) => ma.inspectTimes - mb.inspectTimes)
            .reverse()
            .slice(0, 2)
            .reduce((acc, value) => acc * value.inspectTimes, 1);
        console.log(monkeyBusiness);
    } catch (err) {
      console.log(err);
    }
}
  
main();
 