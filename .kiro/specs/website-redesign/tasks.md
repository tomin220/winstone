# Tasks

## Task List

- [ ] 1. Overhaul design tokens in `src/index.css`
  - [ ] 1.1 Replace font imports: swap Cormorant Garamond + DM Sans for Playfair Display (400, 700, 900) + Inter (300, 400, 500, 600) with `display=swap`
  - [ ] 1.2 Replace all color tokens: add `--accent`, `--accent-light`, `--accent-dim`, `--accent-border`, `--accent-glow`; update `--bg-primary` to `#0B0F1A`, `--bg-secondary` to `#111827`, `--bg-glass` to `rgba(11,15,26,0.78)`; update `--text-primary` to `#F2EDE4`, `--text-secondary` to `#8A8070`, `--text-muted`
  - [ ] 1.3 Add `--font-display` and `--font-body` tokens; update `h1–h6` base styles to use `--font-display`; update `body` to use `--font-body`
  - [ ] 1.4 Add gradient utility tokens: `--grad-accent` and `--grad-surface`
  - [ ] 1.5 Add/update utility classes: `.accent-text`, `.glass-panel`, `.section-pill`, `.btn-primary`, `.btn-ghost`
  - [ ] 1.6 Add `@supports (backdrop-filter: blur(1px))` fallback block so glass panels fall back to solid `--bg-card` in unsupported browsers
  - [ ] 1.7 Add `@media (prefers-reduced-motion: reduce)` block disabling all CSS transitions and animations globally

- [ ] 2. Refresh Navbar styles in `src/components/Navbar.css`
  - [ ] 2.1 Update `.nav-scrolled` to use `--bg-glass`, `backdrop-filter: blur(24px)`, `-webkit-backdrop-filter: blur(24px)`, and `border-bottom: 1px solid var(--accent-border)`
  - [ ] 2.2 Update `.winstone` to use `--font-display` and `.projects` to use `--font-body` with `letter-spacing: 3px`
  - [ ] 2.3 Update `.nav-links a` to use `--font-body` weight 500, `letter-spacing: 1.5px`, and copper `--accent` underline reveal on hover
  - [ ] 2.4 Add `.nav-cta` class with `var(--grad-accent)` background, pill border-radius, and copper glow `box-shadow` on hover
  - [ ] 2.5 Ensure all focus states on nav links and CTA use copper accent outline

- [ ] 3. Upgrade Hero section in `src/pages/Home.css` and `src/pages/Home.jsx`
  - [ ] 3.1 Update `.hero-overlay` gradient to multi-stop from `rgba(11,15,26,0.72)` at top to `rgba(11,15,26,0.92)` at bottom
  - [ ] 3.2 Update `.hero-aurora` animation colors from yellow to copper (`#C96A3A`) + deep teal (`#0D4F4A`) dual-tone radials
  - [ ] 3.3 Update `.serif-text` to use `--font-display` weight 900 at `clamp(4rem, 8vw, 7rem)`; update `.bold-sans-text` to use `--font-body` weight 300 italic
  - [ ] 3.4 Update `.hero-subtitle` pill to use `--bg-glass`, `backdrop-filter: blur(8px)`, and `--accent-border` border with copper dot pulse
  - [ ] 3.5 Update `.btn-solid-gold` to use `var(--grad-accent)` and `.btn-outline-glass` to use cream border styling
  - [ ] 3.6 In `Home.jsx`, wrap hero content children in a Framer Motion `staggerContainer` variant with `staggerChildren: 0.15` and each child using `y: 30 → 0`, `opacity: 0 → 1`
  - [ ] 3.7 In `Home.jsx`, add `useScroll` + `useTransform` parallax to the hero content `motion.div`, mapping scroll progress to `y: 0 → -80px`

- [ ] 4. Add SVG section dividers in `src/pages/Home.jsx` and `src/pages/Home.css`
  - [ ] 4.1 Add `.section-divider` base CSS class with `width: 100%`, `overflow: hidden`, `line-height: 0`, `margin-bottom: -2px`
  - [ ] 4.2 Insert diagonal-cut SVG divider (filled `--bg-secondary`) between Hero and Impact sections in `Home.jsx`
  - [ ] 4.3 Insert soft-wave SVG divider (filled `--bg-primary`) between Partners and Featured Projects sections in `Home.jsx`
  - [ ] 4.4 Insert reverse-diagonal SVG divider between About and Companies sections in `Home.jsx`

- [ ] 5. Upgrade Impact / Stats cards in `src/pages/Home.css`
  - [ ] 5.1 Update `.impact-glow-wrap` (or equivalent card class) to glassmorphism: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 16px`
  - [ ] 5.2 Add `::before` pseudo-element to impact cards with `height: 2px`, `background: var(--grad-accent)`, positioned at card top
  - [ ] 5.3 Update hover state: `transform: translateY(-6px)`, `border-color: var(--accent-border)`, `box-shadow: var(--accent-glow)`
  - [ ] 5.4 Update stat number typography to `--font-display` weight 700 with copper gradient text via `-webkit-background-clip: text`

- [ ] 6. Upgrade Partners marquee in `src/pages/Home.css`
  - [ ] 6.1 Update marquee logo card background to glass panel: `backdrop-filter: blur(8px)`, `-webkit-backdrop-filter: blur(8px)`, copper `--accent-border` on hover
  - [ ] 6.2 Update logo `filter` to `brightness(0) invert(1)` at `opacity: 0.6`, transitioning to `opacity: 0.9` with `drop-shadow(0 0 6px rgba(201,106,58,0.5))` on hover
  - [ ] 6.3 Update edge fade gradients to use `--bg-secondary` color
  - [ ] 6.4 Add `@media (prefers-reduced-motion: reduce)` rule to pause marquee animation (`animation-play-state: paused`)

- [ ] 7. Upgrade Featured Projects carousel in `src/pages/Home.css` and `src/pages/Home.jsx`
  - [ ] 7.1 Update `.csc-card--active` to frosted glass with copper `2px` top border and `border-radius: 20px`
  - [ ] 7.2 Update Framer Motion `transition` in `FeaturedSlideshow` to `type: 'spring', stiffness: 280, damping: 30`
  - [ ] 7.3 Wrap `.csc-card-body` in `AnimatePresence` with `y: 10 → 0`, `opacity: 0 → 1` on mount
  - [ ] 7.4 Update active dot `.csc-dot--active` to copper color with CSS scale pulse `@keyframes` animation

- [ ] 8. Upgrade About section in `src/pages/Home.css` and `src/pages/Home.jsx`
  - [ ] 8.1 Update `.about-section` background to `--bg-secondary` with subtle noise texture overlay
  - [ ] 8.2 Verify/update left column Framer Motion animation to `x: -40 → 0` slide-in on viewport entry
  - [ ] 8.3 Verify/update stat cards staggered entrance: `y: 20 → 0` with `delay: 0.15 + i * 0.08`
  - [ ] 8.4 Update `.about-value-tag` to glass pill with copper `--accent-border` on hover; add `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)` reveal animation on viewport entry

- [ ] 9. Upgrade Companies section in `src/pages/Home.css`
  - [ ] 9.1 Update `.co-card-img` overlay to gradient from transparent to `--bg-card` at bottom
  - [ ] 9.2 Update `.co-card:hover` to scale image `1.06`, translate content `translateY(-4px)`, and reveal copper border
  - [ ] 9.3 Add copper gradient pill label badge (`.co-label`) positioned top-left on card image
  - [ ] 9.4 Update `.co-link` to copper color with arrow and underline reveal on hover

- [ ] 10. Upgrade Awards section in `src/pages/Home.css`
  - [ ] 10.1 Update `.aw-card` to add `border-left: 4px solid var(--accent)` copper left accent bar
  - [ ] 10.2 Update `.aw-card` background to glass styling with `border-radius: 12px`
  - [ ] 10.3 Update `.aw-card:hover` to `translateY(-4px)`, copper `border-color`, and brighten left bar via `border-left-color: var(--accent-light)`

- [ ] 11. Upgrade Leadership section in `src/pages/Home.css`
  - [ ] 11.1 Update `.founder-img-frame` to `border-radius: 20px`, copper border `1px solid var(--accent-border)`, and subtle outer glow `box-shadow: var(--accent-glow)`
  - [ ] 11.2 Update quote box to glass panel with `border-left: 4px solid var(--accent)` and `--font-display` italic text
  - [ ] 11.3 Update bio text to `--font-body` weight 300 with `line-height: 1.8`
  - [ ] 11.4 Update quality pills to glass styling with copper border on hover

- [ ] 12. Upgrade Contact form in `src/pages/Home.css`
  - [ ] 12.1 Update form card to `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(20px)`, `-webkit-backdrop-filter: blur(20px)`, and `border-top: 2px solid var(--accent)`
  - [ ] 12.2 Update form inputs to `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.1)`, and copper `outline` / `border-color` on `:focus`
  - [ ] 12.3 Update submit button to `var(--grad-accent)` full-width with copper glow `box-shadow` on hover
  - [ ] 12.4 Verify success toast uses copper/green accent and error toast uses red/copper accent with entrance animation

- [ ] 13. Upgrade Projects page in `src/pages/Projects.css`
  - [ ] 13.1 Update `.proj-hero` to add diagonal `clip-path` bottom edge and copper radial glow via `radial-gradient`
  - [ ] 13.2 Update `.proj-filter-btn.active` to glass pill with `var(--grad-accent)` gradient background and copper text
  - [ ] 13.3 Update `.pv-card` to glass surface: `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(8px)`, `-webkit-backdrop-filter: blur(8px)`; update `.pv-type-badge` to copper gradient pill; update `.pv-learn-btn` to `var(--grad-accent)`
  - [ ] 13.4 Update `.pv-card:hover` to `translateY(-6px)` and `box-shadow: var(--accent-glow)` with copper border

- [ ] 14. Upgrade Project Detail page in `src/pages/ProjectDetail.css`
  - [ ] 14.1 Update `.pd-back` button to glass pill with copper color and `--accent-border` on hover
  - [ ] 14.2 Update `.sp-hero-right` image frame to copper `border: 1px solid var(--accent-border)` and `border-radius: 16px`
  - [ ] 14.3 Update `.pd-meta-box` and `.sp-meta-box` to glass panel styling; update label icons to copper `--accent` color
  - [ ] 14.4 Update `.pd-highlight-tag` and `.sp-highlight-pill` to glass styling with copper check icon and hover reveal
  - [ ] 14.5 Update `.pd-learn-btn`, `.sp-download-btn`, and `.sp-cta-btn` to `var(--grad-accent)` copper gradient

- [ ] 15. Upgrade Footer in `src/components/Footer.css`
  - [ ] 15.1 Update `.footer-gold-bar` to use `var(--grad-accent)` copper gradient (2px height)
  - [ ] 15.2 Update `.footer` background to `#060A12`
  - [ ] 15.3 Update `.footer-col-title` to `--font-body` weight 700, `letter-spacing: 3px`, with copper `border-bottom` underline using `--accent`
  - [ ] 15.4 Update `.social-link` to glass square styling (`backdrop-filter: blur(8px)`, `-webkit-backdrop-filter: blur(8px)`) with copper color and `--accent-border` on hover
  - [ ] 15.5 Update `.footer-bottom p` to use `--text-muted` cream color
