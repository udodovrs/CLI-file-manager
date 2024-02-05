import { access } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const getDir = async (dir, curentDir) => {
  if (dir.includes(os.homedir())) {
    try {
      await access(dir);
      return dir;
    } catch (e) {
      console.error("Operation failed", e);
    }
  } else {
    const preparedDir = curentDir + path.sep + dir;
    try {
      await access(preparedDir);
      return preparedDir;
    } catch (e) {
      console.error("Operation failed", e);
    }
  }
};

export const checkForZip = async (preparedData, curentDir) => {
  // checking the source and getting absolut path
  const pathTofile = await getDir(preparedData[0], curentDir);

  // checking the destination and getting absolut path
  const splitedPathTodestination = preparedData[1].split(path.sep);
  let nameDistination = null;
  let checkedDistinationDir = null;

  if (splitedPathTodestination.length === 1) {
    nameDistination = splitedPathTodestination[0];
    checkedDistinationDir = curentDir;
  } else {
    nameDistination = splitedPathTodestination.pop();
    const distinationDir = splitedPathTodestination.join(path.sep);
    checkedDistinationDir = await getDir(distinationDir, curentDir);
  }

  return {
    pathTofile,
    checkedDistinationDir,
    nameDistination
  }
};
