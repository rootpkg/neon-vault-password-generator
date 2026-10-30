
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?'

function secureRandomIndex(max) {
  const randomValues = new Uint32Array(1)
  const range = 2 ** 32
  const limit = range - (range % max)

  let value

  do {
    crypto.getRandomValues(randomValues)
    value = randomValues[0]
  } while (value >= limit)

  return value % max
}

export function generatePassword(length, options) {
  let pool = ''
  const requiredCharacters = []

  if (options.uppercase) {
    pool += UPPERCASE
    requiredCharacters.push(
      UPPERCASE[secureRandomIndex(UPPERCASE.length)]
    )
  }

  if (options.lowercase) {
    pool += LOWERCASE
    requiredCharacters.push(
      LOWERCASE[secureRandomIndex(LOWERCASE.length)]
    )
  }

  if (options.numbers) {
    pool += NUMBERS
    requiredCharacters.push(
      NUMBERS[secureRandomIndex(NUMBERS.length)]
    )
  }

  if (options.symbols) {
    pool += SYMBOLS
    requiredCharacters.push(
      SYMBOLS[secureRandomIndex(SYMBOLS.length)]
    )
  }

  if (pool.length === 0) {
    throw new Error('Select at least one character type.')
  }

  if (length < requiredCharacters.length) {
    throw new Error('Password length is too short.')
  }

  const characters = [...requiredCharacters]

  while (characters.length < length) {
    characters.push(pool[secureRandomIndex(pool.length)])
  }

  for (let i = characters.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1)
    ;[characters[i], characters[j]] = [
      characters[j],
      characters[i],
    ]
  }

  return characters.join('')
}

// Estimate strength using length and selected character pool.
export function getPasswordStrength(password, options) {
  let poolSize = 0

  if (options.uppercase) poolSize += UPPERCASE.length
  if (options.lowercase) poolSize += LOWERCASE.length
  if (options.numbers) poolSize += NUMBERS.length
  if (options.symbols) poolSize += SYMBOLS.length

  const entropy = password.length * Math.log2(poolSize)

  if (entropy < 40) {
    return { label: 'Weak', entropy }
  }

  if (entropy < 60) {
    return { label: 'Fair', entropy }
  }

  if (entropy < 80) {
    return { label: 'Strong', entropy }
  }

  return { label: 'Very Strong', entropy }
}

// Educational estimate, assuming 1 billion guesses per second.
export function getCrackTime(entropy) {
  const seconds = Math.pow(2, entropy) / (2 * 1_000_000_000)

  if (seconds < 1) return 'Less than a second'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
  if (seconds < 31536000 * 1000) {
    return `${Math.round(seconds / 31536000)} years`
  }

  return 'Over 1,000 years'
}
