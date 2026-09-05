# AGENT PROMPT: "Genesis" — A macOS-Inspired Scroll Narrative of the Apple Brand

Copy everything below into your coding agent as the task brief.

---

## 1. Project Summary

Build a single-page Next.js web experience called **"Genesis"** that tells the story of the Apple brand's evolution — from the 1976 garage era to today — using a **macOS-inspired UI as the visual language of the story itself**. As the user scrolls, the interface should visually transform era by era: the desktop wallpaper, dock icons, window chrome, typography, and cursor should all evolve to match the design language of that period in Apple's history, while an actual functioning macOS-style desktop (menu bar, dock, draggable windows) sits as the persistent "stage" the story plays out on.

This is NOT a retro/nostalgia site and NOT a literal Apple website clone. It is an original editorial/narrative experience inspired by macOS interaction patterns (menu bar, dock, window chrome, traffic-light buttons) — generic UI conventions, not copyrighted assets. Do not use Apple's actual logo, wordmark, or copyrighted marketing copy anywhere. Use an abstracted/simplified fruit silhouette as a stand-in logo, and write all narrative copy as original prose based on historical facts, never copied text.

---

## 2. Tech Stack

1. Next.js 14+ (App Router), TypeScript, strict mode on.
2. Tailwind CSS for layout and base styling.
3. Framer Motion for all animation (scroll-linked, gesture, and layout animations).
4. Zustand for global UI state (current "era" index, active window stack, dock hover state).
5. `next/font` for typography — use a geometric sans (e.g., Inter or a Google Fonts equivalent) for modern eras and a rounder/pixel-adjacent font for the earliest era, swapped dynamically.
6. Optional: Howler.js for subtle UI sound (dock click, window open) — implement behind a mute-by-default toggle.

---

## 3. Folder Structure

```
/app
  /layout.tsx
  /page.tsx
  /globals.css
/components
  /desktop/MenuBar.tsx
  /desktop/Dock.tsx
  /desktop/Window.tsx
  /desktop/Wallpaper.tsx
  /desktop/CursorTrail.tsx
  /story/EraSection.tsx
  /story/ScrollProgress.tsx
  /story/Timeline.tsx
/lib
  /eras.ts          // data: array of era objects (see section 6)
  /store.ts         // Zustand store
/public
  /wallpapers/...
  /icons/...
```

---

## 4. Global Requirements

1. **Invisible scrollbar, fully functional scroll.** In `globals.css`, hide the scrollbar cross-browser while preserving scroll behavior:
   ```css
   html {
     scrollbar-width: none; /* Firefox */
     -ms-overflow-style: none; /* IE/Edge */
   }
   html::-webkit-scrollbar {
     display: none; /* Chrome/Safari/Edge Chromium */
   }
   ```
   Apply this at the `html`/`body` level, not per-component, so nested scroll containers (like an in-story window with its own scroll) also inherit hidden scrollbars unless explicitly overridden.

2. **Custom scroll progress replaces the native scrollbar** as the only visual scroll indicator — a slim animated line fixed to the right edge of the viewport (2px wide, macOS-accent-blue, low opacity track behind it) driven by Framer Motion's `useScroll`.

3. **60fps target.** Use `transform` and `opacity` for all scroll-linked animation (never top/left/width/height) so the browser stays on the compositor thread. Wrap heavy sections in `will-change: transform`.

4. **Respect `prefers-reduced-motion`.** Provide a reduced-motion variant for every scroll animation (cross-fades instead of parallax/spring, no continuous background motion).

---

## 5. The Persistent macOS Desktop Shell

Build this as an always-visible fixed layer that sits behind/around the scrolling story content — it IS the interface, not a decoration.

1. **MenuBar** (`components/desktop/MenuBar.tsx`) — fixed top bar, ~28px tall, translucent frosted-glass background (`backdrop-filter: blur(20px)`, semi-transparent white/dark depending on era's light/dark mode). Left side shows the abstracted logo mark; right side shows a live clock that actually ticks, updating every second via `useEffect` + `setInterval`. The menu bar's background color and text color should smoothly transition (Framer Motion `animate` on scroll-derived era index) between eras — from a beige/green era-1 palette through to today's dark frosted glass.

2. **Dock** (`components/desktop/Dock.tsx`) — fixed bottom, centered, floating pill shape with frosted glass. Contains 5–7 icons representing eras or milestones (e.g., a garage, a floppy disk, a colorful translucent shell, a click-wheel, a glass slab, a chip). Implement genuine macOS-style magnification: track mouse X position, and for each icon compute a scale value using `useTransform` mapped from distance-to-cursor, with spring physics (`useSpring`, stiffness ~300, damping ~20) so neighboring icons also scale up slightly (falloff curve). Clicking a dock icon smooth-scrolls the page to that era's section.

3. **Window** (`components/desktop/Window.tsx`) — a reusable draggable/resizable window component (use Framer Motion's `drag` prop with `dragConstraints` and `dragElastic={0.05}`) with authentic traffic-light buttons (red/yellow/green, 12px circles, hover reveals close/minimize/expand glyphs). At key story moments, an actual window should animate open (genie/scale-from-dock-icon effect: animate from `scale: 0, opacity: 0, originX/Y` at the dock icon's position, to full size, using a spring transition) to display an artifact from that era — e.g., a window titled "System 1.0" showing a simplified early Mac OS desktop icon grid, or a window titled "Keynote — 2007" showing an abstracted iPhone silhouette.

4. **Wallpaper** (`components/desktop/Wallpaper.tsx`) — full-bleed background behind everything, cross-fading between era-appropriate abstract wallpapers (gradient meshes evoking each era's palette — e.g., era 1: muted beige/brown; era 2: black-and-white grid; era 3 (iMac era): saturated candy translucent colors — bondi blue, tangerine, grape; era 4: brushed aluminum gradient; era 5: dark space-gray gradient with soft glass highlights). Cross-fade with `AnimatePresence` + `opacity` keyed by current era.

5. **CursorTrail** (`components/desktop/CursorTrail.tsx`, optional stretch) — replace the default cursor with a custom one whose shape/color subtly shifts per era (a simple circle in early eras, a soft blurred glow in the modern era).

---

## 6. Era Data Model

Create `/lib/eras.ts` exporting an array like:

```ts
export type Era = {
  id: string;
  years: string;
  title: string;
  palette: { bg: string; accent: string; text: string };
  wallpaper: string; // path or gradient definition
  fontFamily: 'rounded' | 'geometric';
  narrative: string[]; // 2-4 short original paragraphs, NOT copied marketing text
  dockIcon: string;
};

export const eras: Era[] = [
  { id: 'garage', years: '1976–1980', title: 'The Garage', ... },
  { id: 'macintosh', years: '1984', title: 'A Different Kind of Machine', ... },
  { id: 'imac', years: '1998', title: 'Color Returns', ... },
  { id: 'ipod-iphone', years: '2001–2007', title: 'The Pocket Revolution', ... },
  { id: 'today', years: '2011–Present', title: 'Design at Scale', ... },
];
```

Instruct the agent explicitly: **write original 2–4 sentence narrative copy per era based on public historical facts** (founding story, product launches, design philosophy shifts) — never copy text from Apple's own marketing, press releases, or Wikipedia verbatim.

---

## 7. Story Scroll Mechanics

1. Each `EraSection` is a full-viewport-height (`min-h-screen`) section. Use Framer Motion's `useScroll({ target: sectionRef, offset: ["start end", "end start"] })` per section to derive local scroll progress.
2. Map that local progress to:
   - Wallpaper cross-fade opacity for the *next* era, so transitions feel gradual rather than snapped.
   - Parallax offsets for narrative text (`y` transform, subtle, ~40–80px range) vs. background elements (slower, ~10–20px range) for depth.
   - Menu bar and dock color/theme interpolation (use `useTransform` with a color interpolator, e.g. via `framer-motion`'s built-in color animation support).
3. A slim `Timeline` component (fixed left edge, desktop only) shows all eras as dots; the active era's dot is highlighted based on scroll position, and dots are clickable to jump.
4. At least one **"open a window" story beat** per era — the window animates open mid-scroll (triggered via `useInView` or scroll-progress threshold, not a click) to reveal a piece of "content" (an abstracted product silhouette, a simplified UI mockup of that era's OS, a stat/fact card) and then animates closed/minimizes as the user continues scrolling past.

---

## 8. Framer Motion Specifics to Implement

1. Page-level `useScroll` for the global scroll progress bar (replacing the native scrollbar visually).
2. Per-section `useScroll` + `useTransform` for parallax and cross-fades (see above).
3. `useSpring` wrapping raw scroll-derived motion values for the dock magnification and window genie-effect, so movement feels physical rather than linear.
4. `AnimatePresence` for wallpaper cross-fades and window open/close mount-unmount transitions.
5. `staggerChildren`/`delayChildren` in a parent `motion.div` variant for revealing each era's headline + subtext + supporting visual in sequence as the section enters view.
6. `whileHover`/`whileTap` micro-interactions on dock icons and window traffic lights.
7. Respect reduced motion: wrap spring configs in a check against `useReducedMotion()` and fall back to simple `duration`-based tweens with no parallax offset.

---

## 9. Acceptance Criteria

1. Native browser scrollbar is never visible on any screen size, but scrolling (mouse wheel, trackpad, touch, keyboard) works normally everywhere.
2. Menu bar, dock, and wallpaper visually and smoothly transition through at least 5 distinct eras as the user scrolls top to bottom, with no jarring snaps.
3. At least one window-based story beat per era, opening/closing in sync with scroll position, not just on click.
4. Dock magnification behaves like real macOS — smooth, spring-based, with neighbor falloff.
5. All narrative text is original prose, not copied from any Apple source.
6. No use of Apple's actual logo, wordmark, or trademarked product photography — all imagery is abstracted/original.
7. Lighthouse performance score ≥ 85 on mobile; animations stay on the compositor thread (no layout thrashing from scroll listeners).
8. Fully responsive: on mobile, the dock and menu bar simplify (e.g., dock becomes a slimmer bottom bar without magnification) but the era-transition storytelling still works via simpler cross-fades.

---

## 10. Deliverable

A working Next.js app implementing the above, with clean component separation per the folder structure in Section 3, and a short README explaining how to swap in real wallpaper/icon image assets later.
