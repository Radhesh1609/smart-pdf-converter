"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, Download, Loader2 } from "lucide-react"
import { PDFDocument } from "pdf-lib"

interface MergePdfProps {
  onBack: () => void
}

export default function MergePdf({ onBack }: MergePdfProps) {
  const [pdfs, setPdfs] = useState<File[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newPdfs = Array.from(files).filter((file) => file.type === "application/pdf")
    setPdfs((prev) => [...prev, ...newPdfs])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const removePdf = (index: number) => {
    setPdfs((prev) => prev.filter((_, i) => i !== index))
  }

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      alert("Please select at least 2 PDF files to merge")
      return
    }

    setIsConverting(true)
    try {
      const mergedPdf = await PDFDocument.create()

      for (const pdfFile of pdfs) {
        const arrayBuffer = await pdfFile.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "merged.pdf"
      link.click()
      URL.revokeObjectURL(url)

      setPdfs([])
    } catch (error) {
      console.error("Merge error:", error)
      alert("Error merging PDFs")
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
          Merge PDFs
        </h2>
        <p className="text-slate-400 mb-8">Combine multiple PDF files into one</p>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <Upload size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold mb-2">Drag & drop PDF files here</p>
          <p className="text-slate-400">or click to browse (select at least 2 files)</p>
        </div>

        {/* PDF List */}
        {pdfs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Selected PDFs ({pdfs.length})</h3>
            <div className="space-y-2">
              {pdfs.map((pdf, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-400">{index + 1}.</span>
                    <span className="text-white truncate">{pdf.name}</span>
                  </div>
                  <button
                    onClick={() => removePdf(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setPdfs([])}
            className="px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={mergePdfs}
            disabled={pdfs.length < 2 || isConverting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold"
          >
            {isConverting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <Download size={20} />
                Merge PDFs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
