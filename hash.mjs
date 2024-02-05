import { getDir } from "./helpers.mjs";
import { Transform } from "node:stream";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export const getHash = async (rowPathTofile, curentDir) => {
  const hash = createHash("sha256");
  const preparedPathToFile = rowPathTofile.slice(5);
  const pathTofile = await getDir(preparedPathToFile, curentDir);

  const transformStream = new Transform({
    transform(chunk, enc, cb) {
      const getHash = hash.update(chunk).digest("hex");
      enc = "utf8";
      cb(null, getHash);
    },
  });

  const readebleStream = createReadStream(pathTofile);

  readebleStream.pipe(transformStream).pipe(process.stdout);
};
