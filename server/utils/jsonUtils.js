export function chunkTasksBySize(arr, maxSize) {
  let chunks = [];
  let currentChunk = [];
  let currentChunkSize = 2; // for [] brackets

  arr.forEach(obj => {
    const objSize = Buffer.byteLength(JSON.stringify(obj));
    if (currentChunkSize + objSize + 1 > maxSize) { // +1 for comma
      chunks.push(currentChunk);
      currentChunk = [];
      currentChunkSize = 2;
    }
    currentChunk.push(obj);
    currentChunkSize += objSize + 1; // +1 for comma
  });

  if (currentChunk.length) chunks.push(currentChunk);
  return chunks;
}