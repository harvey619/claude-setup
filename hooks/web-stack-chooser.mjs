#!/usr/bin/env node
/**
 * SessionStart hook: offer the stack-and-skill chooser on a NEW web project.
 *
 * The problem it solves: 22 design skills are installed, and the one you forget
 * is the one you needed. A document you have to remember to open does not fix
 * that; a menu that appears at the moment of choosing does.
 *
 * Deliberately quiet. It fires only on a project that looks genuinely new AND
 * has no recorded choice, then never again for that project once `.claude/
 * stack.md` exists. Any error exits silently — a broken hook must never block a
 * session.
 */

import { existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const NEW_PROJECT_COMMIT_CEILING = 5

function quiet() {
  process.exit(0)
}

try {
  // Read the hook payload but do not depend on it; cwd is the reliable signal.
  let stdin = ''
  try {
    stdin = readFileSync(0, 'utf8')
  } catch {
    /* no stdin is fine */
  }
  let payload = {}
  try {
    payload = stdin ? JSON.parse(stdin) : {}
  } catch {
    /* malformed payload is fine */
  }

  const cwd = resolve(payload.cwd || process.cwd())
  const home = resolve(homedir())

  // Never fire in the home directory or inside the Claude config tree.
  if (cwd === home || cwd.startsWith(join(home, '.claude'))) quiet()

  // Already chosen for this project. This is the off switch, and it is the
  // reason the hook does not become noise on a project you return to daily.
  if (existsSync(join(cwd, '.claude', 'stack.md'))) quiet()

  // Explicit opt-out for a project that should never be asked.
  if (existsSync(join(cwd, '.claude', '.no-stack-chooser'))) quiet()

  const pkgPath = join(cwd, 'package.json')
  const hasPkg = existsSync(pkgPath)

  let isWebProject = false
  if (hasPkg) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
      isWebProject = ['react', 'next', 'vite', 'svelte', 'vue', 'astro', '@remotion/cli']
        .some((d) => d in deps)
    } catch {
      quiet()
    }
  }

  // How new is this? A repo with real history is not a new project.
  let commits = 0
  try {
    commits = Number(
      execSync('git rev-list --count HEAD 2>/dev/null', {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim(),
    ) || 0
  } catch {
    commits = 0
  }

  const greenfield = !hasPkg
  const earlyWebProject = isWebProject && commits > 0 && commits <= NEW_PROJECT_COMMIT_CEILING

  // A bare directory with nothing in it is not evidence of intent to build a
  // site, so greenfield only counts when the directory is a fresh git repo or
  // has something in it.
  const looksIntentional =
    greenfield && (existsSync(join(cwd, '.git')) || existsSync(join(cwd, 'index.html')))

  if (!(earlyWebProject || looksIntentional)) quiet()

  const context = `<new-web-project-detected>
This session opened in what looks like a NEW web project (${
    hasPkg ? `web project, ${commits} commit${commits === 1 ? '' : 's'}` : 'no package.json yet'
  }): ${cwd}

Harvir has 22 design/animation/3D skills installed and the recurring problem is
forgetting which ones exist at the moment of choosing. Before writing any code
for this project, run the chooser:

1. Ask what is being built (one line is enough) if it is not already clear.
2. Then use AskUserQuestion to present these decisions. Give each option a real
   TRADEOFF, not just a name. Do not present a flat list of equals — recommend
   one per question and say why.

QUESTION 1 — Design authority (pick exactly ONE; they conflict):
  • impeccable — rolls a defensible direction from a seeded catalogue, writes
    PRODUCT.md + DESIGN.md, has a finish review. Heaviest: several question
    rounds. Best for client work that must be defended.
  • design-taste-frontend — fast anti-templated landing pages, three dials
    (variance/motion/density). Less rigorous about evidence than impeccable.
  • redesign-existing-projects — audit-first, preserves URLs and nav. Wrong for
    greenfield.
  • high-end-visual-design — agency-grade defaults, no process, no gates. Best
    for students and quick work.
  • minimalist-ui / industrial-brutalist-ui — locked looks, skips
    direction-finding entirely.
  • modern-web-design — 2026 trend patterns. WARNING: overlaps the authorities
    above; using it alongside one breaks the one-authority rule.

QUESTION 2 — Motion (multi-select, these compose):
  • motion (motion/react) — the default for React enter/exit, layout, gestures.
  • gsap-scrolltrigger — scroll choreography: pinning, stacking, scrubbing.
  • rive-interactive — state-machine motion reacting to hover/click/app state,
    a fraction of Lottie's size. The one worth learning.
  • lottie-animations — when the asset already exists as Lottie.
  • animejs — SVG and timelines without GSAP's 1.8 MB.
  • react-spring-physics — spring dynamics when a tween feels wrong.
  • locomotive-scroll / scroll-reveal-libraries — smooth scroll and AOS reveals.
    WARNING: smooth scroll breaks Cmd+F and hurts screen readers; native CSS
    animation-timeline: view() is usually the better answer.
  • None — plain CSS transitions. Often correct.

QUESTION 3 — 3D (only if interaction earns it; decorative 3D costs credibility
on a serious product):
  • react-three-fiber — declarative 3D in React, the normal answer.
  • threejs-webgl — imperative control, or a scene small enough that R3F is
    overhead.
  • spline-interactive — designer-made, no code, biggest payload.
  • babylonjs-engine / playcanvas-engine — game engines with physics.
  • pixijs-2d — fast 2D WebGL, not 3D.
  • aframe-webxr — VR/AR.
  • blender-web-pipeline — Blender to web export.
  • None — most sites.

QUESTION 4 — Backend, only if the project needs one:
  • Supabase — Postgres, auth, storage, RLS. The default; already in 5 repos.
  • Firebase — NoSQL, best mobile SDKs and offline sync, but no joins.
  • Neon — serverless Postgres with branching; database only.
  • Convex — TypeScript-native reactive; not SQL.
  • A JSON file — genuinely right more often than people admit.
  • None — static site.

3. WRITE THE ANSWERS to \`.claude/stack.md\` in this project. That file is what
   silences this prompt for this project, and it tells any future session what
   was chosen and why. Include the date and a one-line reason per choice.

If Harvir says "skip" or "not now", write \`.claude/.no-stack-chooser\` (empty
file) so this project never asks again, and carry on with whatever he asked for.

The full reasoning behind every option is in ~/.claude/WEB-PLAYBOOK.md and the
published guide "What To Reach For".
</new-web-project-detected>`

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: context,
      },
    }),
  )
} catch {
  quiet()
}
