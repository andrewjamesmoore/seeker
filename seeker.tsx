import fs from "fs";

const maxResults = 50;
if (!process.getuid) {
  throw new Error(
    "Windows is not supported due to UID-based directory isolation",
  );
}
const cacheDirectory = `/tmp/seeker/${process.getuid()}`;
const cacheFile = `${cacheDirectory}/resulsts.json`;

function isValidCacheDirectory(stats: fs.Stats, uid: number): boolean {
  return stats.uid === uid && stats.isDirectory() && !stats.isSymbolicLink();
}

async function ensureCacheDirectory() {
  await fs.promises.mkdir(cacheDirectory, { recursive: true, mode: 0o700 });
  const stats = await fs.promises.lstat(cacheDirectory);
  const uid = process.getuid!();
  if (!isValidCacheDirectory(stats, uid)) {
    throw new Error(`Error: ${cacheDirectory} is not a safe directory`);
  }
}
