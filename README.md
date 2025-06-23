# Pokemon TCG Booster Pack Opening Simulator

This project is a web-based simulator for opening random Pokémon Trading Card Game (TCG) booster packs. Experience the thrill of opening a pack, revealing cards one by one, and enjoy a visually engaging interface inspired by real pack opening!

## Features

- Fetches random Pokémon TCG cards using the [Pokemon TCG API](https://dev.pokemontcg.io/)
- Interactive booster pack opening animation
- Flip cards to reveal them individually
- Responsive, modern UI with custom icons and gradients
- Error handling for API issues and missing API keys

## Demo

![Demo screenshot](public/paksdotfun_logo_1024.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Bun](https://bun.sh/) (if using bun for package management)
- A [Pokemon TCG API key](https://dev.pokemontcg.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/paksdotfun.git
   cd paksdotfun
   ```
2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```
3. Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env and set POKEMONTCG_API_KEY==your_api_key_here
   ```

### Running the App

Start the development server:

```bash
bun run dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Click or drag the booster pack to open it.
- Click on each card to flip and reveal it.
- Click "Open Another Pack" to try again with a new set of cards.

## Configuration

- The app requires a valid `POKEMONTCG_API_KEY` in your environment variables.
- You can obtain a free API key from [dev.pokemontcg.io](https://dev.pokemontcg.io/).

## Scripts

- `dev` - Start the development server
- `build` - Build for production
- `start` - Start the production server
- `check` - Run Biome code checks
- `check:fix` - Auto-fix code issues with Biome

## Tech Stack

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pokemon TCG SDK TypeScript](https://www.npmjs.com/package/pokemon-tcg-sdk-typescript)

## License

MIT
