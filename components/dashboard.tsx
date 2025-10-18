"use client"

import { FileImage, FileText, Merge as Merge2, Split, HelpCircle, ImageIcon } from "lucide-react"

interface DashboardProps {
  onSelectTool: (tool: string) => void
}

const tools = [
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images to PDF format",
    icon: FileImage,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG images to PDF format",
    icon: ImageIcon,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "text-to-pdf",
    title: "Text to PDF",
    description: "Convert text content to PDF",
    icon: FileText,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "html-to-pdf",
    title: "HTML to PDF",
    description: "Capture webpage as PDF",
    icon: FileText,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "merge-pdf",
    title: "Merge PDFs",
    description: "Combine multiple PDFs into one",
    icon: Merge2,
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract specific pages from PDF",
    icon: Split,
    color: "from-rose-500 to-pink-600",
  },
]

export default function Dashboard({ onSelectTool }: DashboardProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to Smart PDF Converter
        </h2>
        <p className="text-slate-400 text-lg">
          Choose a tool to get started. All conversions happen locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 text-left"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                  {tool.description}
                </p>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-300" />
            </button>
          )
        })}
      </div>

      {/* About button */}
      <div className="flex justify-center">
        <button
          onClick={() => onSelectTool("about")}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 text-slate-300 hover:text-white"
        >
          <HelpCircle size={20} />
          About & Help
        </button>
      </div>
    </div>
  )
}
