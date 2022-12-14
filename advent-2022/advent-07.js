import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "advent-07.data");

class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
}

class Directory {
  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.dirs = [];
    this.files = [];
  }

  getParentDirectory = () => this.parent;
  getChildDirectory = name => this.dirs.find(d => d.name === name);
  addChildDirectory = name => (this.dirs.findIndex(d => d.name === name) === -1) && this.dirs.push(new Directory(name, this));
  addChildFile = (name, size) => (this.files.findIndex(f => f.name === name) === -1) && this.files.push(new File(name, parseInt(size)));
}

const main = async () => {
  try {
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    // const data = "$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k"
    const tree = [ new Directory("/") ];
    const rootDirectory = tree[0];

    let currentDirectory = rootDirectory;
    data.split("\n").forEach((terminalOutput) => {
      const [info, name, arg] = terminalOutput.split(" ");
      if (info === '$') {
        if (name === 'cd') {
          // We assume cd is never attempted if directory was not discovered by a ls command.
          if (arg === '/') currentDirectory = rootDirectory;
          else if (arg === '..') currentDirectory = currentDirectory.getParentDirectory();
          else currentDirectory = currentDirectory.getChildDirectory(arg);
        }
      } else {
        if (info === 'dir') currentDirectory.addChildDirectory(name);
        else currentDirectory.addChildFile(name, info);
      }
    });


    const dirSizes = [];
    const getTotalDirSize = (directories) => {
      return directories.reduce((acc, d) => {
        const filesTotalSize = d.files.reduce((acc, f) => acc + f.size, 0);
        const dirTotalSize = getTotalDirSize(d.dirs);
        
        const totalSize = filesTotalSize + dirTotalSize;
        dirSizes.push(totalSize);
        return acc + totalSize;
      }, 0);
    }

    const availableSpace = 70_000_000;
    const desiredFreeSpace = 30_000_000;

    const usedSpace = getTotalDirSize(tree);
    const freeSpace = availableSpace - usedSpace;
    const spaceToFree = desiredFreeSpace - freeSpace;

    const totalSizeOfLittleDirectories = dirSizes.filter(s => s <= 100_000).reduce((acc, size) => acc + size, 0);
    const smallestSizeOfDirsToFreeSpace = Math.min(...dirSizes.filter(s => s >= spaceToFree));
    console.log('totalSizeOfLittleDirectories', totalSizeOfLittleDirectories);
    console.log('smallestSizeOfDirsToFreeSpace', smallestSizeOfDirsToFreeSpace);
  } catch (err) {
    console.log(err);
  }
};

main();
