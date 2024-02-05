import { open, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { getDir } from "./helpers.mjs";
import { createReadStream, createWriteStream } from "node:fs";

export const catFile = async (rowPathTofile, curentDir) => {
  const preparedPathToFile = rowPathTofile.slice(4);
  const pathTofile = await getDir(preparedPathToFile, curentDir);
  if (pathTofile) {
    createReadStream(pathTofile).pipe(process.stdout);
  }
};

export const newFile = async (rowfileName, curentDir) => {
  const preparedFileName = rowfileName.slice(4);
  try {
    await open(curentDir + path.sep + preparedFileName, "ax");
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const renameFile = async (rowData, curentDir) => {
  const preparedData = rowData.slice(3).split(" ");

  const pathTofile = await getDir(preparedData[0], curentDir);
  const newName = preparedData[1];

  if (!preparedData[1]) {
    return console.error("Operation failed");
  }

  const splitedPathTofile = pathTofile.split(path.sep);
  splitedPathTofile.pop();
  const pathRenamefile = splitedPathTofile.join(path.sep) + path.sep + newName;

  try {
    await rename(pathTofile, pathRenamefile);
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const getCopyFile = async (rowData, curentDir) => {
  const preparedData = rowData.slice(3).split(" ");

  const pathTofile = await getDir(preparedData[0], curentDir);
  const fileName = pathTofile.split(path.sep).pop();
  const checkPathTofile = await getDir(preparedData[1], curentDir);
  const newPathTofile = checkPathTofile + path.sep + fileName;

  try {
    createReadStream(pathTofile).pipe(
      createWriteStream(newPathTofile, {
        flags: "a",
      })
    );
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const deleteFile = async (rowData, curentDir) => {
  const preparedData = rowData.slice(3);
  const pathTofile = await getDir(preparedData, curentDir);
  try {
    await unlink(pathTofile);
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const moveFile = async (rowData, curentDir) => {
  const preparedData = rowData.slice(3).split(" ");

  const pathTofile = await getDir(preparedData[0], curentDir);
  const fileName = pathTofile.split(path.sep).pop();
  const checkPathTofile = await getDir(preparedData[1], curentDir);
  const newPathTofile = checkPathTofile + path.sep + fileName;
  const redable = createReadStream(pathTofile);
  const writeble = createWriteStream(newPathTofile, { flags: "a" });

  try {
    redable.pipe(writeble);
  } catch (e) {
    console.error("Operation failed", e);
  }

  redable.on('end', async ()=> {
    try {
      await unlink(pathTofile);
    } catch (e) {
      console.error("Operation failed", e);
    }
  }) 
};