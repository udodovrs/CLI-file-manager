import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { getDir } from "./helpers.mjs";

export const listDir = async (dir) => {
  try {
    const files = await readdir(dir);
    const result = [];
    files.forEach(async (item) => {
      const statObj = await stat(dir + path.sep + item);
      const itemDir = statObj.isFile()
        ? { Name: item, Type: "file" }
        : { Name: item, Type: "directory" };
      result.push(itemDir);
      if (result.length === files.length) {
        console.table(result);
      }
    });
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const cdToDir = async (rowDir, curentDir) => {
  const dir = rowDir.slice(3);
  return await getDir(dir, curentDir);
};

export const upDir = (curentDir) => {
  if (curentDir === os.homedir()) {
    console.error("Operation failed");
    return curentDir;
  } else {
    const splitedCurrentDir = curentDir.split(path.sep);
    splitedCurrentDir.pop();
    const newDir = splitedCurrentDir.join(path.sep);
    return newDir;
  }
};
