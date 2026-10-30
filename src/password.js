
import zxcvbn from 'zxcvbn'

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

export function generatePassword(length, options = {}) {
  const settings = {
    uppercase: options.uppercase ?? true,
    lowercase: options.lowercase ?? true,
    numbers: options.numbers ?? true,
    symbols: options.symbols ?? true,
  }

  let pool = ''
  const requiredCharacters = []

  if (settings.uppercase) {
    pool += UPPERCASE
    requiredCharacters.push(
      UPPERCASE[secureRandomIndex(UPPERCASE.length)]
    )
  }

  if (settings.lowercase) {
    pool += LOWERCASE
    requiredCharacters.push(
      LOWERCASE[secureRandomIndex(LOWERCASE.length)]
    )
  }

  if (settings.numbers) {
    pool += NUMBERS
    requiredCharacters.push(
      NUMBERS[secureRandomIndex(NUMBERS.length)]
    )
  }

  if (settings.symbols) {
    pool += SYMBOLS
    requiredCharacters.push(
      SYMBOLS[secureRandomIndex(SYMBOLS.length)]
    )
  }

  if (!pool) {
    throw new Error('Select at least one character type.')
  }

  if (!Number.isInteger(length) || length < requiredCharacters.length || length > 64) {
    throw new Error('Choose a valid password length.')
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

export function getPasswordStrength(password) {
  const result = zxcvbn(password)

  const labels = [
    'Weak',
    'Weak',
    'Fair',
    'Strong',
    'Very Strong',
  ]

  return {
    score: result.score,
    label: labels[result.score],
    guesses: result.guesses,
    crackTimesDisplay: result.crack_times_display,
    feedback: result.feedback,
  }
}
