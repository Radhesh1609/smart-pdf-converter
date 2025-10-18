"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, Download, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

interface JpgToPdfProps {
  onBack: () => void
}

export default function JpgToPdf({ onBack }: JpgToPdfProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).filter((file) => file.type.startsWith("image/jpeg"))
    const newPreviews = newImages.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...newImages])
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const convertToPdf = async () => {
    if (images.length === 0) return

    setIsConverting(true)
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      for (let i = 0; i < images.length; i++) {
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve) => {
          img.onload = () => {
            if (i > 0) pdf.addPage()

            const imgWidth = 210
            const imgHeight = (img.height / img.width) * imgWidth

            pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight)
            resolve(null)
          }
          img.src = URL.createObjectURL(images[i])
        })
      }

      pdf.save("converted.pdf")
      setImages([])
      setPreviews([])
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Error converting images to PDF")
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          JPG to PDF Converter
        </h2>
        <p className="text-slate-400 mb-8">Convert your JPG images to PDF format</p>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <Upload size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold mb-2">Drag & drop JPG files here</p>
          <p className="text-slate-400">or click to browse</p>
        </div>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Selected Images ({previews.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-700/50"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
            onClick={() => {
              setImages([])
              setPreviews([])
            }}
            className="px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={convertToPdf}
            disabled={images.length === 0 || isConverting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold"
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
