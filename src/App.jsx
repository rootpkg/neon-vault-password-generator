
import { useState } from 'react'
import {
  generatePassword,
  getPasswordStrength,
  getCrackTime,
} from './password.js'

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

  const options = { uppercase, lowercase, numbers, symbols }

  function handleGenerate() {
    try {
      const newPassword = generatePassword(length, options)
      const result = getPasswordStrength(newPassword, options)

      setPassword(newPassword)
      setStrength(result)
      setError('')
      setCopied(false)
    } catch (err) {
      setPassword('')
      setStrength(null)
      setError(err.message)
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
        />
      </section>

      {strength && (
        <section
          className={`strength-box strength-${strength.label
            .toLowerCase()
            .replace(' ', '-')}`}
        >
          <h2>Strength: {strength.label}</h2>

          <div className="strength-track">
            <div
              className="strength-fill"
              style={{
                width: `${Math.min(
                  100,
                  (strength.entropy / 100) * 100
                )}%`,
              }}
            />
          </div>

          <p>
            Estimated entropy: {Math.round(strength.entropy)} bits
          </p>

          <p>
            Estimated crack time: {getCrackTime(strength.entropy)}
          </p>

          <small>
            Educational estimate assuming 1 billion guesses per second.
            Actual results vary depending on the attack and security system.
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
