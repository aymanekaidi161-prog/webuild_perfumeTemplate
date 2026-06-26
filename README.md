# Maison Aurel — Luxury Fragrance Template

A premium static showcase site for a luxury fragrance brand. Built with **Vite + React + TypeScript + TailwindCSS v3**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:5173` |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint with zero-warnings policy |
| `npm run format` | Prettier format all `src/**/*.{ts,tsx,css}` |

## Design System

### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| `charcoal` | `#1A1A1A` | Page background |
| `charcoal-card` | `#242424` | Card surfaces |
| `charcoal-border` | `#2E2E2E` | Subtle borders |
| `gold` | `#C9A96E` | Primary accent / CTAs |
| `gold-light` | `#E0C48A` | Hover highlights |
| `cream` | `#F5EFE6` | Primary body text |
| `cream-muted` | `#B8AFA4` | Secondary / meta text |

### Typography

- **Headings**: Playfair Display — `font-display`
- **Body / UI**: Inter — `font-sans`

### Reusable Classes

- `.btn-gold` — outlined gold CTA button
- `.btn-gold-filled` — filled gold CTA button
- `.section-padding` — standard section vertical padding

## Folder Structure

```
src/
├── assets/       # Static brand assets (images, SVGs)
├── components/   # Reusable UI components
├── data/         # Static demo data (products, testimonials)
├── hooks/        # Custom React hooks
├── locales/      # i18n strings
└── pages/        # Page-level components
```
