const dict = {
  periode: { id: 'Periode', en: 'Period' },
  dibuat: { id: 'Dibuat', en: 'Created' },
  featureCount: { id: 'Fitur Baru', en: 'New Features' },
  bugfixCount: { id: 'Bug Diperbaiki', en: 'Bugs Fixed' },
  improvementCount: { id: 'Peningkatan', en: 'Improvements' },
  choreCount: { id: 'Pemeliharaan', en: 'Maintenance' },
  executiveSummary: { id: 'Ringkasan Eksekutif', en: 'Executive Summary' },
  keyHighlights: { id: 'Pencapaian Utama', en: 'Key Highlights' },
  issuesResolved: { id: 'Permasalahan Terselesaikan', en: 'Issues Resolved' },
  weeklySummary: { id: 'Ringkasan Mingguan', en: 'Weekly Summary' },
  futurePlans: { id: 'Rencana ke Depan', en: 'Future Plans' },
  benefit: { id: 'Manfaat', en: 'Benefit' },
  systems: { id: 'Sistem', en: 'Systems' },
  systemsUpdated: { id: 'Sistem Terupdate', en: 'Systems Updated' },
  companyName: { id: 'Nama Perusahaan', en: 'Company Name' },
  developerName: { id: 'Nama Developer', en: 'Developer Name' },
  position: { id: 'Posisi', en: 'Position' },
  email: { id: 'Email', en: 'Email' },
} as const

export function t(lang: string | undefined, key: keyof typeof dict): string {
  const entry = dict[key]
  return lang === 'en' ? entry.en : entry.id
}

export function resolveAlias(name: string, aliases: Record<string, string>): string {
  if (aliases[name]) return aliases[name]
  const entry = Object.entries(aliases).find(([k]) => k.split('/')[1] === name)
  return entry ? entry[1] : name
}
