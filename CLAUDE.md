# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js Version Warning

This project uses **Next.js 16** — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## What This Is

FashionHero is a fashion marketplace platform connecting sellers with buyers. It serves as an educational ecommerce template for Wojtek's AI Product Heroes workshops, giving students a professional multi-vendor starting point to learn from and customize.

**Pages implemented:** Home, `/collections/[slug]` (PLP), `/products/[slug]` (PDP)  
**Out of scope:** Real backend, authentication, payments.

## Commands

```bash
npm run dev     # Dev server on http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint check
```

## Tech Stack

- **Framework:** Next.js 16, App Router, React 19, TypeScript strict
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **UI:** shadcn/ui (Radix primitives) + Lucide React icons
- **Data:** Hardcoded in `src/data/` — no backend API
- **Deployment:** Vercel

## Architecture

### Route Structure
```
src/app/
  layout.tsx              # Root layout — loads fonts, wraps in Shell + all Context providers
  page.tsx                # Home (hero carousel, promo tiles, value props)
  collections/[slug]/     # PLP — product grid with filters
  products/[slug]/        # PDP — gallery, size/color picker, add to cart
  account/                # Auth UI (no real validation)
  checkout/               # Checkout UI (no real payments)
  wishlist/               # Wishlist page
```

### Component Organization
```
src/components/
  ui/                     # shadcn/ui primitives (button, etc.)
  sections/               # Full-width page sections:
    hero-carousel.tsx       # Full-width carousel with CTA
    product-carousel.tsx    # Horizontal scrolling products
    promo-tiles.tsx         # Category promotion grid
    feature-story.tsx       # Text + image story block
    value-props.tsx         # Feature highlights
  header.tsx, footer.tsx, announcement-bar.tsx, mega-menu.tsx
  product-grid.tsx, product-card.tsx, filter-sidebar.tsx
  product-info.tsx, image-gallery.tsx, size-selector.tsx, color-swatches.tsx
  cart-drawer.tsx, quick-view-modal.tsx, search-modal.tsx
  auth-provider.tsx, cart-provider.tsx, wishlist-provider.tsx, quick-view-provider.tsx
```

### State Management

Four React Context providers handle all state: **Auth**, **Cart**, **Wishlist**, **QuickView**. All are mounted in `src/app/layout.tsx` wrapping the Shell component.

### Data Layer

`src/data/products.ts`, `collections.ts`, `sellers.ts` — hardcoded data imported directly into routes and components. To add real data: replace these imports with API calls using the same TypeScript interfaces from `src/types/`.

### Styling Conventions

- `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes
- Mobile-first responsive: start with base classes, add `md:` and `lg:` breakpoints
- No inline styles — Tailwind utility classes only
- 2-space indentation, named exports, PascalCase components

## Design References

Use `docs/design-references/` for visual references and `docs/research/` for extracted design tokens, component inventory, and layout architecture.

## Multi-Agent Worktree Pattern

When dispatching Claude Code agent teams to build sections in parallel:
- Each agent works in its own **git worktree branch** (`git worktree add`)
- The orchestrating agent merges all worktrees at the end, resolving conflicts with full project context
