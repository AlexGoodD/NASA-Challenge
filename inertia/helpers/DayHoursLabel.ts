export function generateHourlyLabels() {
  const labels = []
  for (let i = 0; i < 24; i++) {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
    const period = i < 12 ? 'AM' : 'PM'
    labels.push(`${hour}${period}`)
  }
  return labels
}
