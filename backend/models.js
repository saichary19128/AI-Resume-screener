const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  resumeText: String,
  resumeEmbedding: { type: [Number], default: [] },
  uploadedAt: { type: Date, default: Date.now }
});

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  jobEmbedding: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const MatchSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  score: Number,
  suggestions: String,
  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);
const Job = mongoose.model('Job', JobSchema);
const Match = mongoose.model('Match', MatchSchema);

module.exports = { Candidate, Job, Match };
