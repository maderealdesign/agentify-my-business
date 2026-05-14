# Agentify My Business - HermesOS

The autonomous agent, without the terminal.

## What is HermesOS?

Running an autonomous AI agent used to require Docker, Python, and a command line. We stripped all that away. Just a clean chat interface, your favorite LLM models, and a powerful toolbelt for connecting to GitHub, Notion, Maps, and more.

### Key Features

- **No technical setup required** - Clean chat interface instead of terminal commands
- **BYOK (Bring Your Own Keys)** - Securely connect your own API keys stored locally in your browser
- **Transparent pricing** - £10 wallet model for premium models vs throttled free tier
- **Toolbelt system** - Toggle switches to give agents access to external tools

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Build artifacts will be placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Netlify. Push to GitHub and it will automatically deploy.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## License

ISC
