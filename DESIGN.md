# DSWithRavi — Design Brief

## Tone & Concept
Cutting-edge data scientist portfolio. Futuristic, confident, approachable. Bold neon accents on deep dark backgrounds. Glassmorphic layering for premium depth. Digital-forward, recruiter-ready.

## Color Palette

| Token | OKLCH Value | Purpose |
|-------|-------------|---------|
| **Primary (Neon Blue)** | 0.55 0.30 264 | CTAs, active states, highlights, glowing accents |
| **Secondary (Purple)** | 0.48 0.28 294 | Hover states, gradient pairs, accent cards |
| **Background** | 0.10 0 0 | Deep near-black, eye-friendly dark mode base |
| **Card** | 0.14 0 0 | Glassmorphic surfaces, slight lift from background |
| **Muted** | 0.20 0 0 | Subtle separations, secondary backgrounds |
| **Text** | 0.95 0 0 | High-contrast white for readability |
| **Border** | 0.22 0.05 264 | Subtle neon-tinted borders with low chroma |
| **Destructive** | 0.55 0.28 28 | Error/warning states |

## Typography
- **Display**: Space Grotesk (geometric, modern, distinctive brand voice)
- **Body**: Inter (refined, highly readable, professional)
- **Mono**: GeistMono (code samples, data tables, technical content)

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| **Header/Nav** | Glass effect + subtle border-b with primary accent | Sticky navigation, minimal visual weight |
| **Hero** | Full-bleed gradient backdrop (primary to secondary), animated typing text | Immediate visual impact, animated hero section |
| **Content Sections** | Alternating card-grids on muted background | Project cards, skill bars, testimonials |
| **Cards** | Glassmorphic + neon border on hover | Project previews, recruiter hooks, testimonials |
| **CTA Buttons** | Solid primary color + neon glow shadow on hover | Clear hierarchy, compelling interaction |
| **Footer** | Muted background + border-t with accent line | Information separation, contact links |

## Spacing & Rhythm
- Base unit: 8px grid
- Sections: 64px–96px vertical spacing (responsive)
- Cards: 12px–16px internal padding (2xl on large screens)
- Dense skill/project lists: tighter spacing for scannability

## Component Patterns
- **Project Cards**: Glass effect, image preview, tech tags, "View Details" button with neon glow
- **Skill Bars**: Gradient fill, animated on scroll reveal
- **Recruiter Hook Cards**: Bold accent background, icon + headline + description
- **Testimonial Cards**: Quote text, profile image, name/title, glassmorphic surface
- **Buttons**: Primary = solid blue, secondary = glass effect + border, hover = neon glow + border animation
- **Inputs**: Glassmorphic with subtle focus ring in primary color

## Motion & Interaction
- **Scroll Reveal**: Fade-in + slide-up (600ms, easing: cubic-bezier(0.34, 1.56, 0.64, 1))
- **Hover Effects**: Border color → primary, box-shadow → neon glow, slight scale-up (102%)
- **Typing Animation**: Hero section hero text (Ravi's intro), staggered character reveal
- **Pulse Glow**: Subtle infinite animation on featured project cards
- **Page Transitions**: Fade-in on route change (Framer Motion)

## Signature Detail
Neon glow accent + animated border on primary CTAs and featured project cards. When hovering, the glow intensifies (pulse animation), creating a sense of energy and interactivity. Reinforces "cutting-edge tech" aesthetic without overuse.

## Constraints
- **No light mode** — dark theme only, protects brand identity
- **Glassmorphism sparingly** — card surfaces + nav only, avoid over-decoration
- **Neon accents limited** — primary blue + purple, never mix with warm tones
- **Motion restrained** — all animations < 800ms, respects `prefers-reduced-motion`
- **Typography hierarchy** — Space Grotesk for headlines only (h1–h3), Inter for body/UI text, GeistMono for code blocks
- **No drop shadows** — use glassmorphism + borders instead for premium look

## Accessibility
- Minimum AA+ contrast (text on background ≥ 7:1)
- Focusable elements outlined with primary ring color
- Animated content respects `prefers-reduced-motion` media query
- Alt text for all project preview images
- Form labels associated with inputs
