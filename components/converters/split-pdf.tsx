"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, Download, Loader2 } from "lucide-react"
import { PDFDocument } from "pdf-lib"

interface SplitPdfProps {
  onBack: () => void
}

export default function SplitPdf({ onBack }: SplitPdfProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const file = Array.from(files).find((f) => f.type === "application/pdf")
    if (!file) return

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      setPageCount(pdf.getPageCount())
      setPdfFile(file)
      setSelectedPages([])
    } catch (error) {
      alert("Error loading PDF")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b),
    )
  }

  const selectAll = () => {
    if (selectedPages.length === pageCount) {
      setSelectedPages([])
    } else {
      setSelectedPages(Array.from({ length: pageCount }, (_, i) => i))
    }
  }

  const splitPdf = async () => {
    if (!pdfFile || selectedPages.length === 0) {
      alert("Please select at least one page")
      return
    }

    setIsConverting(true)
    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const newPdf = await PDFDocument.create()

      for (const pageNum of selectedPages) {
        const [page] = await newPdf.copyPages(pdf, [pageNum])
        newPdf.addPage(page)
      }

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "split.pdf"
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Split error:", error)
      alert("Error splitting PDF")
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
          Split PDF
        </h2>
        <p className="text-slate-400 mb-8">Extract specific pages from your PDF</p>

        {!pdfFile ? (
          <>
            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-300 mb-8"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Upload size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-semibold mb-2">Drag & drop a PDF file here</p>
              <p className="text-slate-400">or click to browse</p>
            </div>
          </>
        ) : (
          <>
            {/* Page Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Select Pages ({selectedPages.length}/{pageCount})
                </h3>
                <button
                  onClick={selectAll}
                  className="text-sm px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  {selectedPages.length === pageCount ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                {Array.from({ length: pageCount }, (_, i) => i).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => togglePage(pageNum)}
                    className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                      selectedPages.includes(pageNum)
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPdfFile(null)
                  setPageCount(0)
                  setSelectedPages([])
                }}
                className="px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
              >
                Choose Different PDF
              </button>
              <button
                onClick={splitPdf}
                disabled={selectedPages.length === 0 || isConverting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold"
              >
                {isConverting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Extract Pages
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
