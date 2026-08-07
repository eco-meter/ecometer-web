# EcoMeter

A restaurant sustainability scoring platform. Explore restaurants through an interactive 3D globe, view sustainability scores across categories, and discover achievements restaurants have earned.

## Tech stack

- **React** + **Vite**
- **React Three Fiber** for the interactive 3D globe
- **TanStack Query** for data fetching
- **Supabase** for backend, database, and auth

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A Supabase project

### Setup

```bash
git clone <repo-url>
cd ecometer
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project URL and anon key.

### Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## License

Proprietary — see [`LICENSE`](./LICENSE).
