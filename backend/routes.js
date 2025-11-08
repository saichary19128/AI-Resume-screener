const express = require('express');
const multer = require('multer');
const { parsePDFBuffer } = require('./utils/pdfParser');
const { getEmbedding, cosineSimilarity } = require('./utils/embeddings');
const { Candidate, Job, Match } = require('./models');

const router = express.Router();
const upload = multer(); // memory storage

let openaiClient = null;

// ✅ Lazy-load OpenAI only when needed
async function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = (await import('openai')).default;
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// Upload resume, parse, embed, store candidate
router.post('/uploadResume', upload.single('resume'), async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const text = await parsePDFBuffer(req.file.buffer);
    const embedding = await getEmbedding(text);

    const candidate = new Candidate({ name, email, resumeText: text, resumeEmbedding: embedding });
    await candidate.save();

    res.json({ candidateId: candidate._id, message: 'Resume uploaded and processed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a job posting (optionally embed)
router.post('/jobs', async (req, res) => {
  try {
    const { title, description } = req.body;
    const embedding = await getEmbedding(description);
    const job = new Job({ title, description, jobEmbedding: embedding });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Run matching: candidateId + jobId -> similarity + suggestions
router.post('/match', async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    const candidate = await Candidate.findById(candidateId);
    const job = await Job.findById(jobId);
    if (!candidate || !job) return res.status(404).json({ error: 'Candidate or Job not found' });

    const score = cosineSimilarity(candidate.resumeEmbedding, job.jobEmbedding);

    const suggestPrompt = `
You are a helpful resume coach. Given this job description:
---
${job.description}
---
and this candidate resume text:
---
${candidate.resumeText.slice(0, 3000)}
---
Provide:
1) A short compatibility summary (1-2 lines).
2) Bullet 4 targeted improvements the candidate should make to match the job better (skills, keywords, formatting).
Return JSON with fields: summary, suggestions (as array).
`;

    // ✅ Load OpenAI safely (no top-level await)
    const client = await getOpenAIClient();

    const gptResp = await client.chat.completions.create({
      model: process.env.SUGGESTION_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: suggestPrompt }],
      max_tokens: 400,
    });

    const assistantText = gptResp.choices[0].message.content;

    const match = new Match({
      candidate: candidate._id,
      job: job._id,
      score,
      suggestions: assistantText,
    });
    await match.save();

    res.json({ score, suggestions: assistantText, matchId: match._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Basic analytics: average score per job
router.get('/analytics/job/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const agg = await Match.aggregate([
      { $match: { job: require('mongoose').Types.ObjectId(jobId) } },
      { $group: { _id: '$job', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
    ]);
    res.json(agg[0] || { avgScore: 0, count: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

