const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function formatDate(dateStr: string, language = 'id'): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = language === 'en' ? MONTHS_EN : MONTHS_ID
  return `${day} ${months[month - 1]} ${year}`
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
