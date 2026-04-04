# Earth Events Dashboard

A real-time dashboard for visualizing natural events on Earth using
NASA's [EONET](https://eonet.gsfc.nasa.gov/) (Earth Observatory Natural Event Tracker) API.
Built with Next.js, TypeScript, Tailwind CSS, and MapLibre GL JS.

## Features

- Interactive 3D globe with dark/space aesthetic
- Real-time natural event tracking across 13 categories (wildfires, earthquakes,
  volcanoes, storms, floods, and more)
- Category-specific markers with clustering at low zoom levels
- Filter by category, event status (open/closed), date range, and data source
- Event detail panel with magnitude, source links, and temporal progression
- Storm track visualization for multi-geometry events
- Statistics bar with animated counters
- Responsive design: desktop sidebar, mobile bottom drawer
- Shareable filter state via URL parameters
- Auto-refresh with configurable interval

## Setup

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/gamaware/earth-events-dashboard.git
cd earth-events-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open <http://localhost:3000>.

### Build

```bash
npm run build
npm start
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Map | MapLibre GL JS (free, no token needed) |
| Data fetching | SWR |
| Filter state | nuqs (URL search params) |
| Icons | Lucide React |
| Animations | Framer Motion |
| Testing | Vitest + React Testing Library |

## API

This dashboard consumes the NASA EONET v3 API:

- Events: `https://eonet.gsfc.nasa.gov/api/v3/events`
- Categories: `https://eonet.gsfc.nasa.gov/api/v3/categories`
- Sources: `https://eonet.gsfc.nasa.gov/api/v3/sources`
- GeoJSON: `https://eonet.gsfc.nasa.gov/api/v3/events/geojson`

The API is free, requires no authentication, and supports CORS.
Rate limit: 60 requests per minute.

## Architecture

See [docs/adr/](docs/adr/) for Architecture Decision Records.

## License

[MIT](LICENSE)
