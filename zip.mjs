import { createGzip, createUnzip } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { checkForZip } from "./helpers.mjs";

export const compressFile = async (rowData, curentDir) => {
  // removing а command from а request and spliting paths
  const preparedData = rowData.slice(9).split(" ");

  // checking the source and getting absolut path
  const { pathTofile, checkedDistinationDir, nameDistination } =
    await checkForZip(preparedData, curentDir);

  // creating a reading stream
  const source = createReadStream(pathTofile);

  // creating a writinging stream
  const destination = createWriteStream(
    checkedDistinationDir + path.sep + nameDistination
  );

  // archiving
  const gzip = createGzip();

  try {
    source.pipe(gzip).pipe(destination);
  } catch (e) {
    console.error("Operation failed", e);
  }
};

export const decompressFile = async (rowData, curentDir) => {
  // removing а command from а request and spliting paths
  const preparedData = rowData.slice(11).split(" ");

  // checking the source and getting absolut path
  const { pathTofile, checkedDistinationDir, nameDistination } =
    await checkForZip(preparedData, curentDir);

  // creating a reading stream
  const source = createReadStream(pathTofile);

  // creating a writinging stream
  const destination = createWriteStream(
    checkedDistinationDir + path.sep + nameDistination
  );

  // unarchiving
  const unzip = createUnzip();

  try {
    source.pipe(unzip).pipe(destination);
  } catch (e) {
    console.error("Operation failed", e);
  }
};
