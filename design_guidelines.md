# Design Guidelines: Noctoon × Ente Hybrid Platform

## Design Approach
**Hybrid Approach**: Combining Ente's modern glassmorphism aesthetic with Noctoon's comprehensive feature set. Drawing inspiration from **Linear** (clean typography, minimalist layouts) and **Stripe** (gradient accents, smooth animations) while maintaining a manga/anime-focused identity.

## Core Design Elements

### A. Typography
- **Primary Font**: Outfit (Google Fonts) - weights 300, 400, 500, 600, 700, 800
- **Headings**: Font-bold to font-black, tracking-tight for impact
- **Body Text**: Font-medium, comfortable line-height for readability
- **Micro Text**: Uppercase, tracking-widest for labels and meta info

### B. Layout System
**Tailwind Spacing Units**: Primary units are 2, 3, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-12 (mobile), py-20 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Component spacing: space-y-6 for vertical rhythm
- Container: max-w-7xl for main content areas

### C. Color Strategy
**Glassmorphism Theme with Gradient Accents**:
- Glass panels: `rgba(255,255,255,0.6)` light / `rgba(24,24,27,0.6)` dark
- Backdrop blur: 12px consistently
- Primary gradient: Purple to Pink (`from-purple-600 to-pink-500`)
- Accent color: Purple-500 (#8b5cf6)
- Borders: White/5% opacity for glass effect

## Component Library

### Navigation
- **Fixed glassmorphism navbar** with backdrop-blur-md
- Logo: Gradient-filled rounded square icon + bold wordmark
- Search bar: Rounded-full with icon, integrated filter button
- Theme toggle: Sun/moon icons in circular button
- Mobile: Bottom navigation bar with 4-5 primary actions
- Reading progress: 1px height bar at navbar bottom (hidden until reader active)

### Cards & Grid System
- **Series Cards**: 
  - Grid: grid-cols-2 (mobile), md:grid-cols-3, lg:grid-cols-4
  - Rounded-2xl corners, overflow-hidden
  - Hover: scale-105 transform, shadow-2xl elevation
  - Image: Aspect ratio 2:3, object-cover
  - Glass overlay on hover with gradient border
  
### Modals & Popups
- **Login Modal**: Centered, rounded-3xl, glass-panel background
- **Search Filter Modal**: Top-50% transform, scale-in animation
- Backdrop: Slate-900/60 with backdrop-blur-sm
- Buttons: Gradient for primary, ghost for secondary

### Reading Interface
- **Full-screen reader mode** with minimal chrome
- Vertical scroll for webtoon-style reading
- Floating control panel (glass) for chapter navigation
- Keyboard shortcuts: Arrow keys, Esc to exit
- Progress bar synced with scroll position

### Forms & Inputs
- **Rounded-xl borders**, bg-slate-100 dark:bg-dark-800
- Focus state: Ring-2 ring-accent-500/20, border-accent-500
- Placeholder text: text-gray-400, font-medium
- Buttons: Rounded-xl, shadow-lg with color/30 shadow for depth

### Detail Pages (Series)
- **Hero section**: Large cover image (w-60 h-80), rounded-2xl
- Flex layout: Image left, content right (responsive column on mobile)
- Badge system: Genre tags with rounded-full, gradient backgrounds
- Action buttons: Like (heart), Favorite (star), Read (primary gradient)
- Comment section: Glass cards, nested replies support
- Similar series grid: 3-column cards at bottom

### Profile & Admin
- **Dashboard cards**: Glass panels with stats
- Grid layout: grid-cols-2 md:grid-cols-4 for stat boxes
- Icons: Font Awesome with gradient backgrounds
- Charts section: Minimal, accent-colored progress bars

## Animations
- **Splash screen**: Bounce animation on logo, 1.2s fade-out
- **Page transitions**: Fade-in with translateY(10px) start
- **Card hover**: Scale-105, duration-300, ease-out
- **Modal entry**: Scale-in from 95% to 100%, opacity 0 to 1
- **Floating elements**: Subtle 6s ease-in-out infinite for decorative icons
- **Button press**: active:scale-95 for tactile feedback

## Accessibility
- Focus rings: Always visible, 2px accent-500
- Alt text: All images, descriptive for covers
- ARIA labels: Modal overlays, navigation elements
- Keyboard navigation: Tab order, Enter/Space for actions

## Special Features Integration

### Splash Screen
Centered logo with gradient shadow, bounce animation, "Yükleniyor..." text below, dark background, 1.2s auto-hide.

### Advanced Search Modal
Checkbox grid for genres (9 options), radio group for status (4 options), gradient apply button, glass panel design.

### Theme Toggle
Smooth transition between light/dark, icon swap (sun/moon), preserves glass effect opacity adjustments.

### Mobile Bottom Nav
5 icons: Home, Search, Library, Profile, Menu - accent color for active state, transform scale on tap.

## Images
**Hero Images**: Use high-quality anime/manga artwork placeholders (Unsplash: anime, manga, webtoon keywords)
- Series covers: 400×600 vertical format
- Detail page hero: 600×800 high-res
- Reader panels: Variable width, 1000px+ width for clarity

**Placement**:
- Homepage grid: Series cover images
- Detail page: Large cover left, background blur option
- No large hero section on homepage - focus on content grid immediately