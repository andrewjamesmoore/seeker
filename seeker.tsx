import fs from "fs";

const maxResults = 50;
if (!process.getuid) {
  throw new Error(
    "Windows is not supported due to UID-based directory isolation",
  );
}
const cacheDirectory = `/tmp/seeker/${process.getuid()}`;
const cacheFile = `${cacheDirectory}/results.json`;

function isValidCacheDirectory(stats: fs.Stats, uid: number): boolean {
  return stats.uid === uid && stats.isDirectory() && !stats.isSymbolicLink();
}

function ensureCacheDirectory() {
  fs.mkdirSync(cacheDirectory, { recursive: true, mode: 0o700 });
  const stats = fs.lstatSync(cacheDirectory);
  const uid = process.getuid!();
  if (!isValidCacheDirectory(stats, uid)) {
    throw new Error(
      `Error: ${cacheDirectory} is not a safe directory. It's possible this directory is a symbolic link or owned by someone else.`,
    );
  }
}

function saveCache(query: string, results: unknown[]) {
  ensureCacheDirectory();
  fs.writeFileSync(cacheFile, JSON.stringify({ query, results }, null, 2));
}
