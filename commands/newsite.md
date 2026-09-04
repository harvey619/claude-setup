---
description: Choose the stack, design authority, motion and 3D skills for a site, from what is actually installed, with the tradeoffs stated
---

Run the stack-and-skill chooser for this project, on demand.

The SessionStart hook does this automatically on a project that looks new. This
command forces it any time — a project that already has `.claude/stack.md`, one
that opted out, or a mid-build change of direction.

## What to do

**1. Establish what is being built.** One line is enough. If `$ARGUMENTS` says,
use that. If the project already has a `PRODUCT.md`, read it rather than asking
again. Otherwise ask, briefly.

**2. Read the existing choice if there is one.** If `.claude/stack.md` exists,
read it and show what was chosen before. This is a revision, not a fresh start —
say what is changing and why.

**3. Present the decisions with AskUserQuestion.** Recommend one option per
question and give the reason. Never present a flat list of equals; that invites
the safest pick. Every option needs a real tradeoff, not a description.

### Design authority — pick exactly ONE, they conflict

| Skill | Choose when | Costs you |
|---|---|---|
| `impeccable` | Client work the look must be defensible for. Rolls a direction from a seeded catalogue so it cannot drift to the category default; writes PRODUCT.md + DESIGN.md; finish review. | Heaviest. Several question rounds and a review. |
| `design-taste-frontend` | Landing page or portfolio that must not look templated. Three dials: variance, motion, density. | Less rigorous about evidence than impeccable. |
| `redesign-existing-projects` | An existing site being upgraded. Audit-first, preserves URLs and nav labels. | Wrong for greenfield. |
| `high-end-visual-design` | Agency-grade spacing, shadow and type defaults with no process. | A style guide, not a workflow. No gates. |
| `minimalist-ui` / `industrial-brutalist-ui` | The aesthetic is already decided. | Skips direction-finding entirely. |
| `modern-web-design` | 2026 trend patterns and implementation. | **Overlaps the authorities above** — using it alongside one breaks the one-authority-per-project rule. |

### Motion — multi-select, these compose

`motion` (React default) · `gsap-scrolltrigger` (pinning, scrubbing) ·
`rive-interactive` (state-machine motion, tiny, the one worth learning) ·
`lottie-animations` (asset already exists as Lottie) · `animejs` (SVG and
timelines, no GSAP weight) · `react-spring-physics` (spring dynamics) ·
`locomotive-scroll` / `scroll-reveal-libraries` · plain CSS.

State the smooth-scroll tradeoff honestly: Locomotive and Lenis replace native
scrolling, which breaks `Cmd+F` jump-to-match and hurts screen readers. Native
CSS `animation-timeline: view()` gets most of the feel with none of it.

### 3D — only where interaction earns it

`react-three-fiber` (normal answer in React) · `threejs-webgl` (imperative, or a
scene small enough that R3F is overhead) · `spline-interactive` (no code, biggest
payload) · `babylonjs-engine` / `playcanvas-engine` (physics, game-like) ·
`pixijs-2d` (2D WebGL) · `aframe-webxr` (VR/AR) · `blender-web-pipeline` ·
`web3d-integration-patterns` (combining several) · none.

Say plainly that decorative 3D behind a hero costs credibility on a serious
product, and that Three.js is ~565 KB so it must be code-split.

### Backend — only if it needs one

`Supabase` (Postgres + auth + storage + RLS; the default) · `Firebase` (NoSQL,
best mobile SDKs and offline sync, but no joins) · `Neon` (serverless Postgres,
branching, database only) · `Convex` (TypeScript-native reactive, not SQL) ·
a JSON file · none.

If Supabase is chosen, say once: **turn on Row Level Security the same day the
table is created.** A table without RLS is a public table.

**4. Record the answers** in `.claude/stack.md`: the date, each choice, and a
one-line reason. That file silences the automatic prompt for this project and
tells the next session what was decided.

**5. Then get on with the work.** The chooser is a thirty-second gate, not a
ceremony. Load the chosen design authority and start.

## If they want out

`.claude/.no-stack-chooser` (an empty file) stops the automatic prompt for this
project permanently. This command still works.

Full reasoning for every option: `~/.claude/WEB-PLAYBOOK.md`.
