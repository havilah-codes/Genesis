# Genesis

Genesis is a single-page scroll narrative about the evolution of personal technology, staged inside an original macOS-inspired desktop. It uses Framer Motion for scroll and gesture motion, Zustand for era/window state, and inline abstract visuals so it can run without external image assets.

## Run locally

```bash
npm install
npm run dev
```

Era content lives in `lib/eras.ts`. To add real wallpaper or icon assets later, replace the generated wallpaper treatment in `components/GenesisExperience.tsx` and the glyphs in the era `artifact` records with paths from `public/`.
