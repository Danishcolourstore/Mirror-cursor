export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`
  }
  return `₹${amount}`
}

export function toRoman(num: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i]
      num -= vals[i]
    }
  }
  return result
}

export function getGreeting(name: string): { greeting: string; sub: string } {
  const hour = new Date().getHours()
  if (hour < 12) {
    return {
      greeting: `Good morning, ${name}.`,
      sub: 'The light is on your side this week.',
    }
  }
  if (hour < 17) {
    return {
      greeting: `Good afternoon, ${name}.`,
      sub: 'Three weddings in motion.',
    }
  }
  return {
    greeting: `Good evening, ${name}.`,
    sub: "Time to review the day's frames.",
  }
}
