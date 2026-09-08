# My React App

Production-style React + Vite + TypeScript starter with clean folder structure.

## Stack
- React 18 + Vite
- TypeScript
- React Router v6
- Axios (centralized API layer with interceptors)
- Custom hooks (`useFetch`, `useLocalStorage`)
- Context API for global state
- `.env` based configuration

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── assets/          # images, icons
├── components/
│   ├── common/      # Button, Input, etc.
│   ├── layout/       # Header, Footer, Layout
│   └── ui/           # Loader, small UI bits
├── pages/            # Home, About, NotFound
├── hooks/            # useFetch, useLocalStorage
├── services/         # api.ts (axios instance)
├── context/          # AppContext (global state)
├── utils/            # helper functions
├── constants/        # routes, storage keys, app config
├── routes/           # AppRoutes.tsx
├── styles/           # globals.css
├── App.tsx
└── main.tsx
```

## Environment Variables

Set these in `.env`:

```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=MyReactApp
```

For GitHub Pages deployments, add a repository Actions variable named
`VITE_API_BASE_URL` under **Settings > Secrets and variables > Actions > Variables**.
It must be the URL of the backend API, not the GitHub Pages site URL. The Pages
workflow passes this value to Vite at build time.

## Notes
- API base URL and app name are read from `.env` via `import.meta.env`.
- `services/api.ts` auto-attaches auth token from localStorage on every request.
- Add new pages under `src/pages/<PageName>/` and register the route in `src/routes/AppRoutes.tsx`.
