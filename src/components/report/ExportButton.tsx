'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export default function ExportButton({ reportId, title }: { reportId: string; title: string }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    const res = await fetch(`/api/reports/export?id=${reportId}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-60"
    >
      <Download size={16} />
      {loading ? 'Exporting…' : 'Export PDF'}
    </button>
  )
}
