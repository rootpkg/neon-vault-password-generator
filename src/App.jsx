
import { useState } from 'react'
import {
  generatePassword,
  getPasswordStrength,
} from './password.js'

const attackScenarios = [
  {
    key: 'online_throttling_100_per_hour',
    label: 'Online attack with rate limiting',
    description: '100 guesses per hour',
  },
  {
    key: 'online_no_throttling_10_per_second',
    label: 'Online attack without rate limiting',
    description: '10 guesses per second',
  },
  {
    key: 'offline_slow_hashing_1e4_per_second',
    label: 'Offline attack with slow hashing',
    description: '10,000 guesses per second',
  },
  {
    key: 'offline_fast_hashing_1e10_per_second',
    label: 'Offline attack with fast hashing',
    description: '10 billion guesses per second',
  },
]

function App() {
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(null)

  const options = {
    uppercase,
    lowercase,
    numbers,
    symbols,
  }

  function handleGenerate() {
    try {
      const newPassword = generatePassword(length, options)

      // Show the generated password independently of strength analysis.
      setPassword(newPassword)
      setCopied(false)
      setError('')

      try {
        const result = getPasswordStrength(newPassword)
        setStrength(result)
      } catch (analysisError) {
        console.error('Strength analysis failed:', analysisError)
        setStrength(null)
        setError('Password generated, but strength analysis failed.')
      }
    } catch (err) {
      setPassword('')
      setStrength(null)
      setError(err.message || 'Unable to generate password.')
      setCopied(false)
    }
  }

  async function handleCopy() {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setError('')
    } catch {
      setCopied(false)
      setError('Unable to copy password. Please try again.')
    }
  }

  return (
    <main>
      <h1>NEON VAULT</h1>
      <p>Secure Password Generator</p>

      <section className="password-box">
        <label htmlFor="password">Your Password</label>

        <input
          id="password"
          type="text"
          value={password}
          placeholder="Your password will appear here"
          readOnly
          autoComplete="off"
        />
      </section>

      {strength && (
        <section
          className={`strength-box strength-${strength.label
            .toLowerCase()
            .replace(' ', '-')}`}
        >
          <h2>Strength: {strength.label}</h2>

          <div
            className="strength-track"
            role="progressbar"
            aria-label="Password strength"
            aria-valuemin="0"
            aria-valuemax="4"
            aria-valuenow={strength.score}
          >
            <div
              className="strength-fill"
              style={{
                width: `${(strength.score / 4) * 100}%`,
              }}
            />
          </div>

          <p>Strength score: {strength.score} / 4</p>

          <h3>Estimated Crack Times</h3>

          {attackScenarios.map((scenario) => (
            <div className="crack-time" key={scenario.key}>
              <strong>{scenario.label}</strong>
              <p>
                {strength.crackTimesDisplay?.[scenario.key] ?? 'Unavailable'}
              </p>
              <small>{scenario.description}</small>
            </div>
          ))}

          {strength.feedback.warning && (
            <p>
              <strong>Warning:</strong> {strength.feedback.warning}
            </p>
          )}

          {strength.feedback.suggestions.length > 0 && (
            <div>
              <strong>Suggestions</strong>
              <ul>
                {strength.feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <small>
            Estimates use zxcvbn attack models. Actual results depend on
            hardware, hashing methods and security controls.
          </small>
        </section>
      )}

      <section className="length-control">
        <label htmlFor="length">
          Password Length: <strong>{length}</strong>
        </label>

        <input
          id="length"
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(event) => {
            setLength(Number(event.target.value))
            setCopied(false)
          }}
        />
      </section>

      <section className="character-options">
        <h2>Character Types</h2>

        <label>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(event) => {
              setUppercase(event.target.checked)
              setCopied(false)
            }}
          />
          Uppercase Letters (A-Z)
        </label>

        <label>
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(event) => {
              setLowercase(event.target.checked)
              setCopied(false)
            }}
          />
          Lowercase Letters (a-z)
        </label>

        <label>
          <input
            type="checkbox"
            checked={numbers}
            onChange={(event) => {
              setNumbers(event.target.checked)
              setCopied(false)
            }}
          />
          Numbers (0-9)
        </label>

        <label>
          <input
            type="checkbox"
            checked={symbols}
            onChange={(event) => {
              setSymbols(event.target.checked)
              setCopied(false)
            }}
          />
          Symbols (!@#$)
        </label>
      </section>

      <button type="button" onClick={handleGenerate}>
        Generate Password
      </button>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!password}
      >
        Copy Password
      </button>

      {error && <p role="alert">{error}</p>}
      {copied && <p role="status">Copied successfully!</p>}
    </main>
  )
}

export default App
