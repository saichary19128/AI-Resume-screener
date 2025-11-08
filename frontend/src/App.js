import React, { useState } from "react";
import API from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");
  const [result, setResult] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  async function uploadResume(e) {
    e.preventDefault();
    if (!file) return alert("Choose a PDF");
    const form = new FormData();
    form.append("resume", file);
    form.append("name", name);
    form.append("email", email);
    const resp = await API.post("/uploadResume", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setCandidateId(resp.data.candidateId);
    alert("Uploaded. Candidate ID: " + resp.data.candidateId);
  }

  async function createJob(e) {
    e.preventDefault();
    const resp = await API.post("/jobs", { title: jobTitle, description: jobDesc });
    setJobId(resp.data._id);
    alert("Job created: " + resp.data._id);
  }

  async function runMatch() {
    if (!candidateId || !jobId) return alert("Need candidateId and jobId");
    const resp = await API.post("/match", { candidateId, jobId });
    setResult(resp.data);
  }

  async function fetchAnalytics() {
    if (!jobId) return alert("Create a job first");
    const resp = await API.get(`/analytics/job/${jobId}`);
    setAnalytics(resp.data);
  }

  // 🔍 Helper: parse GPT suggestions safely
  function renderSuggestions(raw) {
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-4 shadow-sm">
          <h4 className="font-semibold text-lg text-gray-800 mb-2">Summary</h4>
          <p className="text-gray-700 mb-4">{parsed.summary}</p>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">Suggestions</h4>
          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {parsed.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      );
    } catch {
      return (
        <pre className="bg-gray-100 text-gray-800 p-4 rounded-md mt-2 whitespace-pre-wrap">
          {raw}
        </pre>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          AI Resume Screener Dashboard
        </h1>

        {/* Upload Resume */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1️⃣ Upload Resume
          </h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded-md w-52"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-md w-60"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded-md"
            />
            <button
              onClick={uploadResume}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
          {candidateId && (
            <p className="text-sm text-gray-600">
              ✅ Candidate saved (ID: {candidateId})
            </p>
          )}
        </div>

        {/* Create Job */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2️⃣ Create Job
          </h2>
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="border p-2 rounded-md w-full mb-2"
          />
          <textarea
            placeholder="Job Description"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows="4"
            className="border p-2 rounded-md w-full"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={createJob}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Create Job
            </button>
            <button
              onClick={fetchAnalytics}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              View Job Analytics
            </button>
          </div>
          {jobId && (
            <p className="text-sm text-gray-600 mt-2">
              ✅ Job created (ID: {jobId})
            </p>
          )}
        </div>

        {/* Analytics Card */}
        {analytics && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8 shadow-sm">
            <h3 className="font-semibold text-indigo-700 text-lg mb-2">
              📊 Job Analytics
            </h3>
            <p className="text-gray-700">
              <strong>Average Score:</strong> {analytics.avgScore?.toFixed(2) || 0}%
            </p>
            <p className="text-gray-700">
              <strong>Total Candidates Matched:</strong> {analytics.count || 0}
            </p>
          </div>
        )}

        {/* Match Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3️⃣ Match</h2>
          <button
            onClick={runMatch}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Run Match
          </button>

          {result && (
            <div className="mt-5">
              <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <p className="text-lg font-semibold text-gray-800">
                  Match Score:{" "}
                  <span
                    className={`${result.score > 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {parseFloat(result.score).toFixed(2)}%
                  </span>
                </p>
                {renderSuggestions(result.suggestions)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
