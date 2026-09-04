# Harvir's web build playbook

**How to build a good web app, and which of my tools to reach for at each step.**

Companion to `TOOLKIT.md`. That file is the *inventory* (what is installed).
This file is the *method* (what to pick, in what order, and why).

Written 2026-09-04 from a scan of 26 repos in `~/Projects/Github` plus current
ecosystem state. Re-check the version table (§8) every ~6 months.

---

## 0. How to use this

You are at a decision point. Jump to the table, take the **Default** column
unless a reason in the "Pick something else when" column applies. Do not
deliberate; the defaults are what your own repos already converged on.

| I need to decide… | Go to |
|---|---|
| Framework, and how to start the project | §2 |
| How it should look (design authority) | §3 |
| Components, icons, charts, forms | §4 |
| Animation | §5 |
| 3D | §6 |
| Backend, auth, database, payments | §7 |
| Which LLM, and how to call it safely | §7.4 |
| Is my project out of date? | §8 |
| Testing and deploy | §9 |
| Teaching this to a student | §10 |
| Traps that have actually cost me hours | §11 |

---

## 1. The house stack (what you already build with)

Across 26 repos, this is the convergence. It is a good stack. Use it as the
default and deviate deliberately, not by accident.

```
React 19 + TypeScript
Next.js 16  (content, SEO, auth, server work)   OR   Vite 8  (pure SPA / tool)
Tailwind CSS 4
shadcn/ui  (Radix primitives + CVA + clsx + tailwind-merge)
lucide-react           icons
motion                 animation
recharts               charts
react-hook-form + zod  forms
sonner                 toasts
Supabase               auth + Postgres + storage
Vercel                 deploy
```

**Repos on this stack:** an insurance site, a football-fixtures site, an AI
gifting product, a dashboard project, a student-portfolio site, a HK finance tool.

**Repos that have drifted off it** (§8 explains the cost): a health app
(React 18, Tailwind 3, Vite 6), a SaaS app (Next 14, React 18.2, Tailwind 3),
a legacy React site (react-scripts, Bootstrap, Material-UI v4, node-sass —
this is the "old way", keep it only as a museum piece for teaching).

---

## 2. Framework: Next.js or Vite?

| | **Next.js 16** | **Vite 8** |
|---|---|---|
| Use for | Anything with content, SEO, auth, server routes, or a database | A pure client-side tool, dashboard, or canvas app behind a login |
| Examples | an insurance site, a football-fixtures site, an AI gifting product, a SaaS app | a HK finance tool, a small SPA, a dashboard project, a health app |
| Gives you | RSC, server actions, image optimisation, routing, API routes | Speed, simplicity, no server concepts to teach |
| Costs you | More concepts (server vs client boundary) | You must add routing, and you have no server to hide secrets on |

**Default: Next.js.** Pick Vite only when there is genuinely no server-side
requirement — and note that "I need to call an LLM" *is* a server-side
requirement (§7.4).

**Start a project:**
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
npx shadcn@latest init
```

**Next 16 things worth switching on:** React Compiler (drops nearly all
`useMemo`/`useCallback`), layout deduplication, View Transitions. The compiler is
stable but *not* on by default — you already enable it via
`babel-plugin-react-compiler` in a sports-stats site, an AI gifting product and a student-portfolio site.

---

## 3. Design authority — pick exactly ONE per project

These conflict. Two in one project gives contradictory rules for the same files.
Full descriptions live in `TOOLKIT.md` §1; this is the decision.

| Situation | Pick | Why |
|---|---|---|
| Client work; the look must be defensible | `impeccable` | Rolls a direction from a seeded catalog so output can't drift to the category default. Writes `PRODUCT.md` + `DESIGN.md`. Heaviest: several question rounds and a finish review. |
| Landing page or portfolio, must not look templated | `design-taste-frontend` | Three dials (VARIANCE / MOTION / DENSITY). Fast. |
| Existing site being upgraded, not replaced | `redesign-existing-projects` | Audit-first, preserves URLs and nav labels. |
| You want agency-grade defaults, no process | `high-end-visual-design` | A style guide, not a workflow. No gates. |
| The aesthetic is already decided | `minimalist-ui` or `industrial-brutalist-ui` | Locked looks. Skip direction-finding entirely. |
| Student project, teaching fundamentals | `high-end-visual-design` | Least process, most transferable lessons. |

**The rule that matters most:** *refinement preserves, redesign replaces, never
split the difference.* Polishing a look you've decided to discard is wasted work.

**Worked example:** a fabrication-studio site and a HK finance tool both
carry `PRODUCT.md` + `DESIGN.md` from `impeccable`. Once `DESIGN.md` exists, the
detector can compare code against a documented system:

```bash
node ~/.claude/skills/impeccable/scripts/detect.mjs --json src/ui src/App.tsx
```

That is worth real money — on a recent build it caught an orphaned CSS class that had
silently unstyled **every table in the product**.

---

## 4. Components, icons, charts, forms

| Need | Default | Pick something else when |
|---|---|---|
| Component library | **shadcn/ui** (Radix + CVA) | Never, for React. It is copy-in code you own and edit, not a dependency. Its whole value is that it lives in your repo. |
| Icons | **lucide-react** | You need brand logos → `simple-icons`. See §11 for the import trap. |
| Charts | **recharts** | Charts are the product → D3. Big dashboards → `visx`. |
| Forms | **react-hook-form + zod** | Trivial one-field form → plain state. |
| Toasts | **sonner** | — |
| Tables | **@tanstack/react-table** | Under ~5 columns → a plain `<table>`. |
| Dates | **date-fns** | — |
| Smooth scroll | **lenis** | Almost always skip it. It fights native scroll and hurts accessibility. |

**Before writing a chart**, load the `dataviz` skill. Colour choice and chart
form are decided there, not improvised.

**MUI vs shadcn:** a dashboard project has both (`@mui/material` *and* Radix). Don't. Pick
one; two component systems means two visual languages in one app.

---

## 5. Animation

| Need | Use | Notes |
|---|---|---|
| React component motion: enter/exit, layout, gestures | **`motion`** (`motion/react`) | The default. ~34–46 KB gzipped. Framer Motion was renamed Motion in Feb 2025 — import from `motion/react`, and use the `motion` package, not the legacy `framer-motion` one. |
| Scroll choreography, timelines, SVG morph, text splitting | **GSAP** (+ ScrollTrigger) | Reach for it only when Motion genuinely can't. ~1.8 MB full lib. `gpt-taste` carries the GSAP scroll patterns. |
| Simple hover / focus / colour transitions | **plain CSS** | Cheapest and most reliable. Don't import a library for a 150 ms hover. |
| A video file (ad, reel, promo) | **`remotion-*` skills** | A *video*, not website motion. Never ship a video where CSS belongs. |

**Rules that keep motion from looking amateur:**
- Product UI transitions: **150–250 ms**. Landing/hero entrances may run longer.
- Motion must convey **state** — change, feedback, loading, reveal. Nothing else.
- No orchestrated page-load sequences in app UI. Users came to do a task.
- **`prefers-reduced-motion` is not optional.** A CSS reset does *not* cover
  JS-driven animation — see §11.

---

## 6. 3D

Ask first: **does interactivity earn it?** A configurator or product viewer,
yes. A spinning blob behind a hero, no — on a finance or health product it
actively costs credibility.

| Situation | Use |
|---|---|
| 3D inside React (the normal case) | **`@react-three/fiber` + `@react-three/drei`** — declarative, and Drei turns 30 lines of Three.js into 1–2 |
| Non-React, or you need imperative control | **`three`** directly |
| Designer-led, no dev time, simple scene | **Spline** (`@splinetool/react-spline`) — fast, less control, bigger payload |
| Rebuilding a real object from a photo | **`img2threejs` skill** — objects, not scenes |
| Just need to *see* a scene while working | **Three.js MCP** (`show_threejs_scene`) — the browser pane throttles rAF |

**Your usage:** a football-fixtures site uses R3F (right call). A HK finance tool
uses raw `three` (defensible — a few hundred line segments, and R3F would have
added weight for no gain). An AI gifting product uses Spline.

**Non-negotiables:**
- **Code-split it.** Three.js is ~565 KB. Lazy-load it and paint the page first.
- **Real HDRI lighting.** Poly Haven, free, no key. Metal lit by a CSS gradient
  always looks fake. 1k HDRI ≈ 1.5 MB; 512px textures are usually enough.
- **Never `setState` in a frame loop.** Grab a ref and mutate the object; 60
  `setState` calls a second will destroy the frame rate.
- Procedural code-built geometry tops out at "clean diagram". Heroes want
  photography; 3D belongs where interaction earns it.

---

## 7. Backend, data, and AI

### 7.1 Auth + database
**Supabase**, by default. Postgres, auth, storage, edge functions, row-level
security, generous free tier. You already use it in a health app, a SaaS app,
a dashboard project, a football-fixtures site, an AI gifting product. There is an MCP server for it — migrations
and RLS from here.

**Always turn RLS on.** A Supabase table without row-level security is a public
table. This is the single most common student mistake.

### 7.2 Payments
**Stripe** (a SaaS app, an AI gifting product). Never handle card details yourself — Checkout
or Elements only.

### 7.3 Email
**Resend** (a SaaS app, an AI gifting product).

### 7.4 Choosing an LLM — and the one rule you cannot break

**THE RULE: an API key must never reach the browser.** Anything in
`import.meta.env.VITE_*` (Vite) or `NEXT_PUBLIC_*` (Next) is **public** and ships
in the bundle. Call the model from a server route, a Next server action, or a
Supabase Edge Function. Never from the client.

Claude models (verify current pricing before quoting it to anyone):

| Model | ID | Context | $/MTok in | out | Reach for it when |
|---|---|---|---|---|---|
| Claude Opus 5 | `claude-opus-5` | 1M | $5 | $25 | **Default.** Best general capability per dollar at this tier. |
| Claude Sonnet 5 | `claude-sonnet-5` | 1M | $2 | $10 | High volume where Opus is more than you need |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1 | $5 | Classification, extraction, cheap sub-agents |
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10 | $50 | Hardest reasoning / long-horizon agent work |

**Load the `claude-api` skill before writing any Claude call.** The API moved
in 2025–26 and training-data memory is stale — notably `budget_tokens` is gone
(use `thinking: {type: "adaptive"}`), and assistant prefill now 400s.

**Architecture pattern that survives contact with reality** (from a recent build):
> Let the model produce **assumptions**, never the final numbers. Compute the
> answer with pure functions you can unit-test. An LLM that writes the number
> means you can never test the output; an LLM that writes the *inputs* means you
> can test everything downstream. Always force JSON-only output, parse
> defensively, and fall back to a hardcoded default if parsing fails.

That pattern is worth teaching on its own.

---

## 8. The currency check — is my project stale?

Run this against any repo. Two or more "behind" values means schedule an upgrade.

| Package | Current (Sep 2026) | Behind if |
|---|---|---|
| `react` | 19.2.x | 18.x |
| `next` | 16.2.x | ≤ 15 |
| `tailwindcss` | 4.x | 3.x |
| `vite` | 8.x | ≤ 6 |
| `motion` | 12–13.x | you still import `framer-motion` |
| `three` | 0.185.x | ≤ 0.16x |
| `typescript` | 5.9 / 6.x | ≤ 5.5 |

```bash
npx npm-check-updates          # see what is behind
npx npm-check-updates -u && npm install   # take it
```

**Tailwind 3 → 4 is the highest-value upgrade** you have outstanding
(a health app, a SaaS app). v4 drops the PostCSS dependency, uses a Rust engine, and
config moves into CSS via `@theme`. Faster builds and less setup.

---

## 9. Testing and deploy

| Layer | Tool | What it is for |
|---|---|---|
| Logic, pure functions | **Vitest** | Anything with arithmetic or rules. Fast, run constantly. |
| User journeys | **Playwright** (`e2e-playwright` skill) | Multi-step flows, phase changes, responsive structure. |
| Types | `tsc -b` in the build | Non-negotiable. |
| Design system drift | `impeccable` detector | Only works once `DESIGN.md` exists. |

**Deploy:** Vercel for anything Next (MCP available — build logs, runtime errors,
analytics). GitHub Pages for a static site. Never send anyone a `localhost` link.

**The testing lesson that cost me most:** unit tests prove functions are right.
They cannot prove a user can get from the front door to the thing they came for.
The moment an app grows multi-step flows, that gap is where bugs live — and
"the component rendered" is *not* the same as "the page looks right".

---

## 10. Teaching a student to build a web app

Order matters. Each step should produce something they can see.

1. **HTML + CSS by hand, once.** One page, no framework. They must know what
   Tailwind and React are hiding before they hide it.
2. **Then Tailwind.** Same page, rebuilt. The speed difference is the lesson.
3. **Then React + Vite.** Components and props. Still no server, no database.
4. **Then state and forms.** `useState`, then react-hook-form + zod. Introduce
   validation as *product design*, not chore work.
5. **Then Next.js.** Only now — the server/client boundary is the hardest idea
   in modern web dev and it needs the rest as foundation.
6. **Then Supabase.** Auth and a real table. **Teach RLS the same day**, or they
   will ship a public database.
7. **Then deploy.** Vercel. A real URL they can send to a parent is worth more
   motivationally than three more features.
8. **Then tests.** Vitest on one pure function, then one Playwright journey.
9. **Only then** animation and 3D. These are seasoning. A student who reaches for
   3D before they can lay out a form builds something impressive-looking and
   unusable.

**Things to insist on from day one:** TypeScript (not JS), semantic HTML,
`alt` text, keyboard access, and one accessible name on every button. These cost
nothing early and are painful to retrofit.

**Marking a student project — six honest questions:**
1. Does it work on a phone?
2. Can you use it with only a keyboard?
3. What happens on a slow connection, and on failure?
4. Is there a real empty state, or does it show `[]`?
5. Are the secrets on the server?
6. If a stranger opened it, would they know what it does in five seconds?

---

## 11. Traps that have actually cost hours

Earned, not theoretical.

**Bundle**
- A namespace icon import (`import * as Icons from 'lucide-react'`) took a real
  bundle from **795 KB → 1,440 KB**. Import each icon by name, always.
- Code-split Three.js and any charting library. Check `dist/` after every build;
  Vite warns above 500 KB and the warning is worth obeying.

**Secrets**
- `VITE_*` and `NEXT_PUBLIC_*` are **public**. This is the most expensive mistake
  a student can make, and it is invisible until someone reads the bundle.

**CSS**
- Renaming a class in markup does **not** rename it in CSS. Orphaned rules fail
  silently — no error, no warning, just unstyled elements. After any refactor:
  `grep -rn "old-class" src/`.
- Product UI should use a **fixed** type scale, not `clamp()`. Fluid type belongs
  on a landing hero; a heading that shrinks beside a sidebar just looks wrong.

**Motion + accessibility**
- A `prefers-reduced-motion` CSS reset does **not** stop Framer/Motion tweens or
  Recharts animations — they don't run on CSS-animation semantics. Add
  `<MotionConfig reducedMotion="user">` and set `isAnimationActive={false}` on
  charts.
- Icon-only buttons need `aria-label`. A `×` character is not an icon: it
  inherits font metrics and sits off the optical centre.
- Modals need `role="dialog"`, `aria-modal`, an accessible name, a focus trap,
  Escape handling, **and focus restored to the trigger on close.** The last one is
  the one everybody forgets.

**Playwright**
- Vite binds to `localhost` (IPv6), **not** `127.0.0.1`. A `127.0.0.1` webServer
  URL times out waiting for a server that is already running.
- `playwright install chromium` does **not** install `chromium-headless-shell`,
  which every mobile device profile needs. Install both.
- Set `reducedMotion: 'reduce'` globally. It removes animation timing as a flake
  source and tests a path real users switch on.
- Select by **role and accessible name**, never CSS class. A test that breaks on
  a rename teaches the team to ignore red.

**Process**
- Verify **appearance**, not just that a component rendered. "The section
  mounted" and "the page looks right" are different claims, and only one of them
  is what the user sees.
