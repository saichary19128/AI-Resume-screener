// const OpenAI = require('openai');

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function getEmbedding(text) {
//   if (!text) return [];
//   const resp = await client.embeddings.create({
//     model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
//     input: text
//   });
//   return resp.data[0].embedding;
// }

// function cosineSimilarity(a, b) {
//   if (!a || !b || a.length === 0 || b.length === 0) return 0;
//   let dot = 0.0, na = 0.0, nb = 0.0;
//   for (let i = 0; i < Math.min(a.length, b.length); i++) {
//     dot += a[i] * b[i];
//     na += a[i] * a[i];
//     nb += b[i] * b[i];
//   }
//   return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
// }

// module.exports = { getEmbedding, cosineSimilarity };

// backend/utils/embeddings.js
const OpenAI = require('openai');

const USE_MOCK = process.env.MOCK_OPENAI === 'true';
let client = null;
if (!USE_MOCK) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// simple deterministic pseudo-embedding from text — stable and cheap for testing
function pseudoEmbedding(text, dim = 1536) {
  const emb = new Array(dim);
  let h = 2166136261 >>> 0; // FNV-1a base
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  // fill with values derived from hash (normalized)
  for (let i = 0; i < dim; i++) {
    // create some variability but deterministic
    const val = (((h >>> (i % 24)) & 0xff) - 128) / 128;
    emb[i] = val;
  }
  return emb;
}

async function getEmbedding(text) {
  if (!text) return [];
  if (USE_MOCK) {
    return pseudoEmbedding(text);
  }
  // real OpenAI call
  const resp = await client.embeddings.create({
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    input: text
  });
  return resp.data[0].embedding;
}
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  // prevent divide-by-zero
  if (magA === 0 || magB === 0) return 0;

  const similarity = dot / (magA * magB);

  // Clamp between -1 and 1, then convert to percentage
  const safeSim = Math.max(-1, Math.min(1, similarity));
  return (safeSim * 100).toFixed(2);
}

module.exports = { getEmbedding, cosineSimilarity };

