"use client"

import { useState } from "react"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import html2pdf from "html2pdf.js"

interface HtmlToPdfProps {
  onBack: () => void
}

export default function HtmlToPdf({ onBack }: HtmlToPdfProps) {
  const [html, setHtml] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [preview, setPreview] = useState(false)

  const convertToPdf = () => {
    if (!html.trim()) {
      alert("Please enter some HTML content")
      return
    }

    setIsConverting(true)
    try {
      const element = document.createElement("div")
      element.innerHTML = html

      const opt = {
        margin: 10,
        filename: "webpage.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      }

      html2pdf().set(opt).from(element).save()
      setHtml("")
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Error converting HTML to PDF")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 text-slate-300 hover:text-white"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          HTML to PDF Converter
        </h2>
        <p className="text-slate-400 mb-8">Convert HTML content or webpage snapshots to PDF</p>

        {/* HTML Input */}
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML content here... (e.g., <h1>Title</h1><p>Content</p>)"
          className="w-full h-64 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none mb-8 font-mono text-sm"
        />

        {/* Preview Toggle */}
        {html.trim() && (
          <div className="mb-8">
            <button
              onClick={() => setPreview(!preview)}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold text-sm"
            >
              {preview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        )}

        {/* Preview */}
        {preview && html.trim() && (
          <div className="mb-8 p-4 rounded-lg bg-white text-black border border-slate-700/50 max-h-96 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setHtml("")}
            className="px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
          >
            Clear
          </button>
          <button
            onClick={convertToPdf}
            disabled={!html.trim() || isConverting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold"
          >
            {isConverting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download size={20} />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
