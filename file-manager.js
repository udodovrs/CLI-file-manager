import os from "node:os";
import { pipeline } from "node:stream";
import { Transform } from "node:stream";
import { listDir, upDir, cdToDir } from "./navigate.mjs";
import {
  catFile,
  newFile,
  renameFile,
  getCopyFile,
  deleteFile,
  moveFile,
} from "./fs.mjs";
import { getCPUarch, getEOL, getCpus, getHomeDir, getUserName } from "./os.mjs";
import { getHash } from "./hash.mjs";
import { compressFile, decompressFile } from "./zip.mjs";

let userName = null;
let currentDir = os.homedir();

process.argv.forEach((item) => {
  if (item.includes("username")) {
    const indexOfEqual = item.indexOf("=");
    userName = item.slice(indexOfEqual + 1);
  }
});

process.stdout.write(
  `Welcome to the File Manager, ${userName}!\nYou are currently in path ${currentDir}\n`
);

const transformStream = new Transform({
  transform(chunk, enc, cb) {
    let preparedData = null;
    const chunkStringified = chunk.toString().trim();

    if (chunkStringified === "ls") {
      listDir(currentDir);
    } else if (chunkStringified === ".exit") {
      console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
      process.exit(0);
    } else if (/^cd ./.test(chunkStringified)) {
      cdToDir(chunkStringified, currentDir).then((data) => {
        currentDir = data;
        console.log(`You are currently in ${currentDir}`);
      });
    } else if (chunkStringified === "up") {
      currentDir = upDir(currentDir);
    } else if (/^cat ./.test(chunkStringified)) {
      catFile(chunkStringified, currentDir);
    } else if (/^add ./.test(chunkStringified)) {
      newFile(chunkStringified, currentDir);
    } else if (/^rn ./.test(chunkStringified)) {
      renameFile(chunkStringified, currentDir);
    } else if (/^cp ./.test(chunkStringified)) {
      getCopyFile(chunkStringified, currentDir);
    } else if (/^rm ./.test(chunkStringified)) {
      deleteFile(chunkStringified, currentDir);
    } else if (/^mv ./.test(chunkStringified)) {
      moveFile(chunkStringified, currentDir);
    } else if (chunkStringified === "os --EOL") {
      getEOL();
    } else if (chunkStringified === "os --cpus") {
      getCpus();
    } else if (chunkStringified === "os --homedir") {
      getHomeDir();
    } else if (chunkStringified === "os --username") {
      getUserName();
    } else if (chunkStringified === "os --architecture") {
      getCPUarch();
    } else if (/^hash ./.test(chunkStringified)) {
      getHash(chunkStringified, currentDir);
    } else if (/^compress ./.test(chunkStringified)) {
      compressFile(chunkStringified, currentDir);
    } else if (/^decompress ./.test(chunkStringified)) {
      decompressFile(chunkStringified, currentDir);
    } else {
      preparedData = "Invalid input \n";
    }

    enc = "utf8";
    cb(null, preparedData);

    if (!/^cd ./.test(chunkStringified)) {
      console.log(`You are currently in ${currentDir}`);
    }
  },
});

pipeline(process.stdin, transformStream, process.stdout, (err) => {
  if (err) {
    console.error(err);
  }
});

process.on("SIGINT", () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
});
