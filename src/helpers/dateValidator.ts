export const dateValidator = (value: number) => {
  if (!value) return false

  const dateObj = new Date(value)
  const dateString = dateObj.toISOString()

  if (dateString === 'Invalid Date') return false

  return true
}
