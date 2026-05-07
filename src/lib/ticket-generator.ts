export function generateTicketId(universityName: string): string {
  // Extract initials from university name (max 3 chars)
  const initials = universityName
    .split(' ')
    .filter((w) => w.length > 2)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 3)

  const number = Math.floor(1000 + Math.random() * 9000)
  return `${initials}-${number}`
}
