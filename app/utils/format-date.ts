export function parseDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00")
}

export function monthDay(dateStr: string) {
  const d = parseDate(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${mm}/${dd}`
}
