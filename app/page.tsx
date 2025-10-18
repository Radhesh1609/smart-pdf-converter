"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import Dashboard from "@/components/dashboard"
import JpgToPdf from "@/components/converters/jpg-to-pdf"
import PngToPdf from "@/components/converters/png-to-pdf"
import TextToPdf from "@/components/converters/text-to-pdf"
import HtmlToPdf from "@/components/converters/html-to-pdf"
import MergePdf from "@/components/converters/merge-pdf"
import SplitPdf from "@/components/converters/split-pdf"
import About from "@/components/about"

type Tool =
  | "dashboard"
  | "jpg-to-pdf"
  | "png-to-pdf"
  | "text-to-pdf"
  | "html-to-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "about"

export default function Home() {
  const [currentTool, setCurrentTool] = useState<Tool>("dashboard")
  const [isDark, setIsDark] = useState(true)

  const renderTool = () => {
    switch (currentTool) {
      case "jpg-to-pdf":
        return <JpgToPdf onBack={() => setCurrentTool("dashboard")} />
      case "png-to-pdf":
        return <PngToPdf onBack={() => setCurrentTool("dashboard")} />
      case "text-to-pdf":
        return <TextToPdf onBack={() => setCurrentTool("dashboard")} />
      case "html-to-pdf":
        return <HtmlToPdf onBack={() => setCurrentTool("dashboard")} />
      case "merge-pdf":
        return <MergePdf onBack={() => setCurrentTool("dashboard")} />
      case "split-pdf":
        return <SplitPdf onBack={() => setCurrentTool("dashboard")} />
      case "about":
        return <About onBack={() => setCurrentTool("dashboard")} />
      default:
        return <Dashboard onSelectTool={setCurrentTool} />
    }
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                📄
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Smart PDF Converter
              </h1>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderTool()}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 backdrop-blur-md bg-slate-950/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400 text-sm">
            <p className="mb-2">© 2025 Smart PDF Converter | No server, 100% offline</p>
            <p className="text-xs">
              All conversions happen locally in your browser • Your data never leaves your device
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
