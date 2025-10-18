"use client"

import { ArrowLeft } from "lucide-react"

interface AboutProps {
  onBack: () => void
}

export default function About({ onBack }: AboutProps) {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 text-slate-300 hover:text-white"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          About Smart PDF Converter
        </h2>

        <div className="space-y-6 text-slate-300">
          <section>
            <h3 className="text-xl font-bold text-white mb-3">🔒 100% Offline & Private</h3>
            <p>
              All conversions happen locally in your browser. Your files never leave your device, and we don't store any
              data on our servers. Your privacy is our priority.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">⚡ Fast & Efficient</h3>
            <p>
              No waiting for uploads or server processing. Conversions happen instantly on your machine, making it
              perfect for batch operations and large files.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">🎯 Supported Conversions</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>JPG/PNG images to PDF</li>
              <li>Text content to PDF</li>
              <li>HTML/Webpages to PDF</li>
              <li>Merge multiple PDFs</li>
              <li>Split PDFs by page selection</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">💡 Tips & Tricks</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use drag & drop to quickly upload files</li>
              <li>Preview your files before conversion</li>
              <li>Batch convert multiple images at once</li>
              <li>All conversions are lossless</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">🛠️ Technology</h3>
            <p>
              Built with modern web technologies including jsPDF, pdf-lib, and html2pdf for reliable, client-side PDF
              processing.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
