import React from "react";

function ResumePage() {
return (
<div className="min-h-screen bg-gray-50 text-gray-800 font-sans leading-relaxed">
  <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
    {/* Header */}
    <header className="border-b pb-4 mb-6">
      <h1 className="text-4xl font-bold text-gray-900">Sai Kumar</h1>
      <p className="text-lg text-gray-600">
        AI & ML Engineer | Full Stack Developer
      </p>
      <div className="mt-2 text-sm text-gray-500 space-y-1">
        <p>
          Email:{" "}
          <a href="mailto:sai@example.com" className="text-blue-600 hover:underline">
            sai@example.com
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a href="https://linkedin.com/in/saikumar" className="text-blue-600 hover:underline">
            linkedin.com/in/saikumar
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a href="https://github.com/saikumar" className="text-blue-600 hover:underline">
            github.com/saikumar
          </a>
        </p>
      </div>
    </header>

    {/* Summary */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-3">
        Profile Summary
      </h2>
      <p>
        Passionate Artificial Intelligence and Machine Learning Engineer
        with experience in deep learning, web development (MERN), and
        data-driven problem solving. Skilled at building scalable
        applications and integrating AI models into real-world products.
      </p>
    </section>

    {/* Skills */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-3">
        Technical Skills
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <ul className="list-disc list-inside">
          <li>Python, C++, JavaScript</li>
          <li>React, Node.js, Express, MongoDB</li>
          <li>TensorFlow, OpenCV, scikit-learn</li>
        </ul>
        <ul className="list-disc list-inside">
          <li>Data Structures & Algorithms</li>
          <li>RESTful APIs, Git, Docker</li>
          <li>Cloud Deployment (Vercel, Render, AWS)</li>
        </ul>
      </div>
    </section>

    {/* Experience */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-3">
        Experience
      </h2>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          AI Project – Leukemia Classification
        </h3>
        <p className="text-sm text-gray-600">
          TensorFlow | Image Processing | CNN
        </p>
        <ul className="list-disc list-inside mt-1 text-gray-700">
          <li>
            Developed a CNN model to classify leukemia subtypes using
            medical images.
          </li>
          <li>
            Applied data augmentation, regularization, and feature
            optimization techniques.
          </li>
          <li>
            Achieved 94% accuracy and automated report generation using
            Flask backend.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          Full Stack Developer – Password Manager App
        </h3>
        <p className="text-sm text-gray-600">
          MERN Stack | REST APIs | JWT Authentication
        </p>
        <ul className="list-disc list-inside mt-1 text-gray-700">
          <li>
            Built a secure password management system using React, Node.js,
            and MongoDB.
          </li>
          <li>
            Integrated user authentication and AES-based password encryption.
          </li>
          <li>
            Deployed full-stack app on Render with responsive React UI.
          </li>
        </ul>
      </div>
    </section>

    {/* Education */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-3">
        Education
      </h2>
      <p>
        <strong>Osmania University</strong> – B.E. in Artificial
        Intelligence & Machine Learning
      </p>
      <p className="text-gray-600">Expected Graduation: 2026</p>
    </section>

    {/* Footer */}
    <footer className="text-center text-sm text-gray-500 mt-10">
      © 2025 Sai Kumar — Built with Tailwind CSS
    </footer>
  </div>
</div>
);
}

export default ResumePage;