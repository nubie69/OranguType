# TypeLab

A minimal React, TypeScript, Vite, and Tailwind CSS starter.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The build checks TypeScript and writes the production app to `dist/`.

## Source structure

```text
src/
  components/  Reusable UI components
  pages/       Page components (currently Home)
  hooks/       React hooks
  utils/       Utility functions
  data/        Static application data
  types/       Shared TypeScript types
  App.tsx      Application root
  main.tsx     React entry point
  index.css    Tailwind CSS entry point
```

The homepage displays only “TypeLab”. The remaining folders are placeholders
for future development.
