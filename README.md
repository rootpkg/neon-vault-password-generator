
# NEON VAULT — Secure Password Generator

NEON VAULT is a browser-based password generator built with React, JavaScript, and Vite. It creates random passwords using the Web Crypto API.

## Features

- Generate passwords from 8 to 64 characters.
- Choose uppercase letters, lowercase letters, numbers, and symbols.
- Secure random number generation using `crypto.getRandomValues()`.
- Ensures every selected character category is represented.
- Copy generated passwords to the clipboard.
- View estimated password strength and entropy.
- Educational crack-time estimate.
- Responsive cyberpunk-inspired interface.
- No account, backend, database, or external API required.

## Technology

- React
- JavaScript
- Vite
- CSS
- Web Crypto API

## Run Locally

Requirements: Node.js and npm.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run code checks:

```bash
npm run lint
```

## Security Notes

NEON VAULT uses the browser's cryptographically secure random number generator.

The password strength and crack-time values are educational estimates, not security guarantees. Actual password security depends on the generation process, storage, hashing, attack conditions, and the systems where passwords are used.

Passwords are generated locally in the browser. The application does not send generated passwords to a server.

## Project Structure

```text
neon-vault-password-generator/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── password.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## License

Choose and add a license before distributing this project as open-source software.
