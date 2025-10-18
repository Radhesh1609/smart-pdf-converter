"use client"

import { useState } from "react"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

interface TextToPdfProps {
  onBack: () => void
}

export default function TextToPdf({ onBack }: TextToPdfProps) {
  const [text, setText] = useState("")
  const [isConverting, setIsConverting] = useState(false)

  const convertToPdf = () => {
    if (!text.trim()) {
      alert("Please enter some text")
      return
    }

    setIsConverting(true)
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageHeight = pdf.internal.pageSize.getHeight()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 15
      const lineHeight = 7
      const maxWidth = pageWidth - 2 * margin

      pdf.setFontSize(12)
      pdf.setFont("helvetica")

      const lines = pdf.splitTextToSize(text, maxWidth)
      let yPosition = margin

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(line, margin, yPosition)
        yPosition += lineHeight
      })

      pdf.save("text-document.pdf")
      setText("")
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Error converting text to PDF")
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
          Text to PDF Converter
        </h2>
        <p className="text-slate-400 mb-8">Convert your text content to PDF format</p>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none mb-8"
        />

        {/* Character Count */}
        <div className="text-sm text-slate-400 mb-8">{text.length} characters</div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setText("")}
            className="px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
          >
            Clear
          </button>
          <button
            onClick={convertToPdf}
            disabled={!text.trim() || isConverting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold"
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
