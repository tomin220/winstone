# Requirements Document

## Introduction

This document defines the requirements for the Winstone Projects website redesign. The redesign replaces the existing dark-luxury aesthetic (flat black + champagne gold) with a distinctive editorial brand identity using a midnight navy + electric copper + warm cream palette, Playfair Display + Inter typography, glassmorphism cards, SVG section dividers, and Framer Motion micro-interactions. All changes are confined to CSS files and minor JSX motion additions — no routing, data, or Supabase logic is modified.

## Glossary

- **Design_System**: The CSS custom property token layer defined in `src/index.css`
- **Navbar**: The fixed top navigation component (`Navbar.css` / `Navbar.jsx`)
- **Hero**: The full-viewport video hero section at the top of the Home page
- **Impact_Cards**: The 4-column stat grid in the Impact section of the Home page
- **Carousel**: The 3D card stack featured-projects carousel on the Home page
- **Section_Divider**: An inline SVG element placed between page sections to create diagonal or wave transitions
- **Glass_Card**: A card component using `backdrop-filter: blur()` and semi-transparent background
- **Framer_Motion**: The animation library used for entrance animations and parallax effects
- **Copper**: The electric copper accent color `#C96A3A` used as the primary highlight
- **Cream**: The warm cream text color `#F2EDE4` used as the primary text color
- **Navy**: The midnight navy background color `#0B0F1A`
- **Playfair_Display**: The display/heading font replacing Cormorant Garamond
- **Inter**: The body/UI font replacing DM Sans

## Requirements

### Requirement 1: Design Token System

**User Story:** As a developer, I want a single source of truth for all visual variables, so that the new palette and typography are applied consistently across every component.

#### Acceptance Criteria

1. THE Design_System SHALL define `--accent: #C96A3A`, `--accent-light: #E8895A`, `--accent-dim: rgba(201,106,58,0.15)`, and `--accent-border: rgba(201,106,58,0.28)` as CSS custom properties in `src/index.css`
2. THE Design_System SHALL define `--bg-primary: #0B0F1A`, `--bg-secondary: #111827`, `--bg-card: rgba(255,255,255,0.03)`, and `--bg-glass: rgba(11,15,26,0.78)` as CSS custom properties
3. THE Design_System SHALL define `--text-primary: #F2EDE4`, `--text-secondary: #8A8070`, and `--text-muted: rgba(242,237,228,0.38)` as CSS custom properties
4. THE Design_System SHALL import Playfair Display (weights 400, 700, 900) and Inter (weights 300, 400, 500, 600) from Google Fonts with `display=swap`
5. THE Design_System SHALL define `--font-display: 'Playfair Display', Georgia, serif` and `--font-body: 'Inter', system-ui, sans-serif`
6. WHEN Google Fonts CDN is unreachable, THE Design_System SHALL fall back to `Georgia, serif` for display and `system-ui, sans-serif` for body text
7. THE Design_System SHALL provide utility classes `.accent-text`, `.glass-panel`, `.section-pill`, `.btn-primary`, and `.btn-ghost`
8. IF a CSS custom property token is missing, THEN THE Design_System SHALL not produce broken styles due to missing fallback values

### Requirement 2: Navbar Visual Refresh

**User Story:** As a visitor, I want a polished navigation bar that reflects the new brand identity, so that the site feels premium from the first interaction.

#### Acceptance Criteria

1. WHEN the user scrolls down, THE Navbar SHALL apply `background: var(--bg-glass)`, `backdrop-filter: blur(24px)`, and a `1px solid var(--accent-border)` bottom border
2. THE Navbar SHALL display the logo wordmark "WINSTONE." in Playfair Display and "PROJECTS" in Inter uppercase with `letter-spacing: 3px`
3. THE Navbar SHALL render navigation links in Inter 500 with `letter-spacing: 1.5px` and a copper underline reveal on hover
4. THE Navbar SHALL include a CTA button styled with `var(--grad-accent)` copper gradient, pill border-radius, and a copper glow `box-shadow` on hover
5. WHILE the page is at the top (not scrolled), THE Navbar SHALL remain transparent with no background

### Requirement 3: Hero Section

**User Story:** As a visitor, I want a dramatic, editorial hero section, so that the brand identity is immediately communicated on page load.

#### Acceptance Criteria

1. THE Hero SHALL display the title "Winstone" in Playfair Display weight 900 at `clamp(4rem, 8vw, 7rem)` and "Projects" in Inter weight 300 italic below it
2. THE Hero SHALL apply a multi-stop overlay gradient from `rgba(11,15,26,0.72)` at top to `rgba(11,15,26,0.92)` at bottom over the video background
3. THE Hero SHALL replace the yellow aurora animation with a copper + deep teal dual-tone radial aurora
4. WHEN the page loads, THE Hero SHALL animate its content children with a staggered entrance: `opacity: 0 → 1`, `y: 30 → 0`, with 0.15s stagger between children using Framer_Motion
5. WHEN the user scrolls, THE Hero SHALL apply a parallax effect shifting the hero content `y` by up to `-80px` using Framer_Motion `useScroll` and `useTransform`
6. THE Hero SHALL display a subtitle pill with frosted glass background, `--accent-border` border, and a copper dot pulse animation
7. THE Hero SHALL render a primary CTA button with copper gradient and a ghost CTA button with glass styling and cream border

### Requirement 4: Section Dividers

**User Story:** As a visitor, I want smooth visual transitions between page sections, so that the page feels cohesive and editorial rather than flat.

#### Acceptance Criteria

1. THE Section_Divider SHALL be implemented as inline SVG elements requiring no additional HTTP requests
2. THE Section_Divider SHALL be placed between the Hero and Impact sections using a diagonal cut variant filled with `var(--bg-secondary)`
3. THE Section_Divider SHALL be placed between the Partners and Featured Projects sections using a soft wave variant filled with `var(--bg-primary)`
4. THE Section_Divider SHALL be placed between the About and Companies sections using a reverse diagonal variant
5. WHEN rendered, THE Section_Divider SHALL have `overflow: hidden` and `margin-bottom: -2px` to prevent gaps between sections

### Requirement 5: Impact / Stats Cards

**User Story:** As a visitor, I want the stats section to feel modern and premium, so that key company metrics are presented with visual impact.

#### Acceptance Criteria

1. THE Impact_Cards SHALL use glassmorphism styling: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 16px`
2. THE Impact_Cards SHALL display a 2px copper gradient bar at the top of each card using a `::before` pseudo-element with `background: var(--grad-accent)`
3. WHEN hovered, THE Impact_Cards SHALL transition with `translateY(-6px)`, copper border color, and `box-shadow: var(--accent-glow)`
4. THE Impact_Cards SHALL display stat numbers in Playfair Display 700 with copper gradient text

### Requirement 6: Partners Marquee

**User Story:** As a visitor, I want the partner logos to scroll smoothly in a premium-feeling strip, so that the brand's credibility is communicated elegantly.

#### Acceptance Criteria

1. THE Partners marquee SHALL display logo cards as glass panels with `backdrop-filter: blur(8px)` and a copper border on hover
2. THE Partners marquee SHALL render logos with `filter: brightness(0) invert(1)` at 60% opacity, transitioning to 90% opacity with a copper drop-shadow on hover
3. THE Partners marquee SHALL apply edge fade gradients from `--bg-secondary` to transparent on both left and right sides
4. WHERE the user has `prefers-reduced-motion: reduce` set, THE Partners marquee SHALL pause or disable the scrolling animation

### Requirement 7: Featured Projects Carousel

**User Story:** As a visitor, I want the featured projects carousel to feel polished and interactive, so that I can explore projects with a premium browsing experience.

#### Acceptance Criteria

1. THE Carousel active card SHALL use frosted glass styling with a copper top-border accent and `border-radius: 20px`
2. THE Carousel SHALL use Framer_Motion spring transitions with `stiffness: 280, damping: 30` for card position changes
3. WHEN the active card changes, THE Carousel SHALL animate the card body content with `AnimatePresence` using `y: 10 → 0` fade-in
4. THE Carousel SHALL display the active dot indicator with a copper color and scale pulse animation

### Requirement 8: About Section

**User Story:** As a visitor, I want the About section to feel editorial and trustworthy, so that the company's story is communicated with visual authority.

#### Acceptance Criteria

1. THE About section SHALL apply `--bg-secondary` background with a subtle noise texture overlay
2. WHEN the About section enters the viewport, THE About section SHALL animate the left column with `x: -40 → 0` slide-in using Framer_Motion
3. WHEN the About section enters the viewport, THE About section stat cards SHALL animate with staggered `y: 20 → 0` entrance with 0.08s delay between each card
4. THE About section value tags SHALL use glass pill styling with a copper border on hover and a `clip-path` reveal animation on viewport entry

### Requirement 9: Companies Section

**User Story:** As a visitor, I want the company cards to feel immersive and premium, so that each group company is presented with visual distinction.

#### Acceptance Criteria

1. THE Companies section cards SHALL display a full-bleed image at the top with a gradient overlay from transparent to `--bg-card` at the bottom
2. WHEN a company card is hovered, THE Companies section SHALL scale the card image to `1.06`, slide the content panel up `4px`, and reveal a copper border
3. THE Companies section SHALL display a copper gradient pill label badge positioned top-left on each card image
4. THE Companies section "View on Instagram" link SHALL display in copper color with an arrow and underline reveal on hover

### Requirement 10: Awards Section

**User Story:** As a visitor, I want the awards to be displayed with visual prestige, so that the company's recognition is communicated credibly.

#### Acceptance Criteria

1. THE Awards section cards SHALL display a 4px copper left accent bar using a `border-left` style
2. THE Awards section cards SHALL use glass background styling with `border-radius: 12px`
3. WHEN an award card is hovered, THE Awards section SHALL apply `translateY(-4px)`, a copper border, and brighten the left accent bar

### Requirement 11: Founder / Leadership Section

**User Story:** As a visitor, I want the leadership section to feel authoritative and personal, so that the founder's story is presented with editorial quality.

#### Acceptance Criteria

1. THE Leadership section photo frame SHALL use `border-radius: 20px`, a copper border, and a subtle outer glow
2. THE Leadership section quote box SHALL use glass panel styling with a copper left border and Playfair Display italic text
3. THE Leadership section bio text SHALL use Inter weight 300 with generous line-height
4. THE Leadership section quality pills SHALL use glass styling with a copper border on hover

### Requirement 12: Contact Form

**User Story:** As a visitor, I want the contact form to feel premium and trustworthy, so that I am confident submitting an enquiry.

#### Acceptance Criteria

1. THE Contact form card SHALL use `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(20px)`, and a copper top border
2. THE Contact form inputs SHALL use `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.1)`, and a copper focus ring
3. THE Contact form submit button SHALL use copper gradient styling, full-width layout, and a soft glow on hover
4. WHEN the form submission succeeds, THE Contact form SHALL display an animated success toast with a copper/green accent
5. WHEN the form submission fails, THE Contact form SHALL display an animated error toast

### Requirement 13: Projects Page

**User Story:** As a visitor, I want the Projects page to feel consistent with the new brand identity, so that browsing projects feels premium throughout.

#### Acceptance Criteria

1. THE Projects page hero SHALL apply a diagonal clip-path bottom edge and a copper radial glow background
2. THE Projects page filter tabs SHALL use glass pill styling with a copper active state using gradient background
3. THE Projects page project cards SHALL use glass surface styling, a copper type badge, image zoom on hover, and a copper CTA button
4. WHEN a project card is hovered, THE Projects page SHALL apply `translateY(-6px)` and a copper border glow

### Requirement 14: Project Detail Page

**User Story:** As a visitor, I want the project detail pages to feel immersive and consistent with the new brand, so that individual project exploration feels premium.

#### Acceptance Criteria

1. THE Project_Detail back button SHALL use glass pill styling with a copper color and border on hover
2. THE Project_Detail single-project hero SHALL use a split grid layout with the image in a copper border-radius frame
3. THE Project_Detail meta boxes SHALL use glass panel styling with copper label icons
4. THE Project_Detail highlight pills SHALL use glass styling with a copper check icon and hover reveal animation
5. THE Project_Detail download and CTA buttons SHALL use copper gradient styling

### Requirement 15: Footer

**User Story:** As a visitor, I want the footer to feel polished and on-brand, so that the site ends with the same premium quality it starts with.

#### Acceptance Criteria

1. THE Footer SHALL display a 2px copper gradient bar at the very top as a divider
2. THE Footer SHALL use `#060A12` as the background color
3. THE Footer column titles SHALL use Inter 700 with `letter-spacing: 3px` and a copper underline
4. THE Footer social icons SHALL use glass square styling with copper color and border on hover
5. THE Footer bottom bar SHALL display muted cream text for copyright and tagline

### Requirement 16: Accessibility and Cross-Browser Compatibility

**User Story:** As a user with accessibility needs or a non-Chrome browser, I want the redesigned site to remain fully usable, so that the visual upgrade does not exclude any users.

#### Acceptance Criteria

1. WHERE `backdrop-filter` is not supported by the browser, THE Design_System SHALL fall back to a solid `--bg-card` background via `@supports` CSS feature query
2. ALL `backdrop-filter` declarations SHALL include a `-webkit-backdrop-filter` vendor prefix for Safari compatibility
3. ALL interactive elements (buttons, links, form inputs) SHALL maintain visible focus states using the copper accent color
4. WHERE the user has `prefers-reduced-motion: reduce` set, THE Design_System SHALL disable or minimize all CSS and Framer_Motion animations
5. THE Copper accent color `#C96A3A` SHALL meet WCAG AA contrast ratio requirements against `--bg-primary` (`#0B0F1A`) for large text usage
