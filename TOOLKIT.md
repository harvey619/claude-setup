# Harvir's toolkit

Inventory + decision framework. Generated from disk 2026-09-02 — **35 global skills**
in `~/.agents/skills/` (symlinked into Claude Code) and `~/.claude/skills/`.

> **Building a web app? Read [`WEB-PLAYBOOK.md`](WEB-PLAYBOOK.md) instead.**
> This file is the *inventory* — what is installed. That file is the *method* —
> which framework, design authority, animation, 3D, backend and LLM to pick at
> each step, with the defaults my own 26 repos already converged on, plus a
> teaching order for students and the traps that have actually cost hours.

Harvir will not remember what is installed. **Do not make him name things.** Read the
decision framework at the bottom and put a recommendation in front of him.

---

## 1. Design authority — pick exactly ONE per project

These conflict. Two of them in one project produces contradictory rules for the same
files. Choose one, say which, and say why.

| Skill | Choose it when | What it costs you |
|---|---|---|
| `impeccable` | Client work where the direction must be defensible. Rolls a direction from a seeded catalog so the output can't drift to the category default, enforces a craft floor, runs a detector hook on every edit, writes DESIGN.md + sidecar. | Heaviest. Many gates, several question rounds, a finish review. Overkill for a quick page. |
| `design-taste-frontend` | Fast landing page or portfolio that must not look templated. Three dials: VARIANCE / MOTION / DENSITY. | Less rigorous about factual claims and evidence than impeccable. |
| `gpt-taste` | You want aggressive GSAP motion and wide editorial type, AIDA page structure. | Opinionated to the point of fighting a subtle brief. |
| `redesign-existing-projects` | An existing site is being upgraded, not replaced. Audit-first, preserves URLs and nav labels. | Wrong for greenfield. |
| `high-end-visual-design` | You want agency-grade spacing/shadow/type defaults without a whole process. | A style guide, not a process. No gates. |
| `stitch-design-taste` | You need a portable DESIGN.md other tools can read. | Produces a doc, not a site. |

**Locked looks** (skip direction-finding, the aesthetic is already decided):
`minimalist-ui` — warm monochrome, editorial, flat bento.
`industrial-brutalist-ui` — Swiss print + military terminal, rigid grid, extreme type contrast.

## 2. 3D, imagery and reference

| Skill | Choose it when | Honest limit |
|---|---|---|
| `img2threejs` | Hand-built Three.js geometry looks basic and you have a reference photo. Rebuilds an object procedurally with a vision loop that compares render against photo until they match. | **Objects, not scenes.** Its own rubric rejects "a photo that is a scene, not an object reference". A deck-plus-house-plus-cover photo fails; an isolated gate passes. 21 gated steps — budget for it. |
| `imagegen-frontend-web` | You want comps to react to before any code. One image per section. | Images only. No code. |
| `imagegen-frontend-mobile` | iOS/Android screen concepts and flows. | Images only. |
| `brandkit` | Brand-guideline boards, logo systems, identity decks. | Images only. |
| `image-to-code` | Generate a reference image, analyse it, then build to match it. | Slower than designing directly. |
| `3d-web-experience` | Installed 2026-09-03. Three.js / R3F / Spline / WebGL. Stack decision tree, model pipeline, scroll-driven 3D, perf budgets, and validation checks (WebGL fallback, loading state, mobile DPR, OrbitControls capturing scroll). | Its decision tree says "React → React Three Fiber" — **override that when bundle size matters.** R3F + drei costs ~600KB for a scene with no GLTF models; vanilla three, tree-shaken and lazy-loaded, was ~137KB gzip in its own chunk on a recent build. Its guidance is about scenes with assets, not data-driven line work. |

**Poly Haven** (plain HTTP, no key, CC0): the cheapest large gain in any 3D scene is a
real HDRI — metal lit by a canvas gradient always looks fake.
`https://api.polyhaven.com/assets?t=hdris` → `https://api.polyhaven.com/files/<slug>` →
`https://dl.polyhaven.org/file/ph-assets/...`. 1k HDRI ≈ 1.5 MB; textures at 512px are
usually enough (~60 KB each).

**The rule learned the hard way:** procedural code-built architecture tops out at "clean
diagram". A hero is expected to read as a photograph; a configurator is expected to read
as a diagram. Put real photography in heroes and 3D where interactivity earns it.

## 3. Motion and video — two different jobs, do not confuse them

| Need | Use | Not |
|---|---|---|
| Animation **on the website** — scroll reveals, hovers, transitions, 3D | CSS, the `motion` library, GSAP, Three.js. `gpt-taste` carries GSAP scroll patterns. | Not Remotion. Shipping a video where CSS belongs makes the page heavier and less responsive. |
| A **video file** — ad, reel, promo, demo, social cut | `remotion-*` (12 skills, official from remotion-dev) | Not CSS. |

Remotion routes through `remotion-best-practices`; the others handle create, studio
preview, render/export, captions, maps, multimedia, interactivity, SaaS, upgrades.
Remotion is a **per-project npm dependency**, not a global tool: `npx create-video@latest`.

### Claude Design Skillstack — per-library skills (added 2026-09-05)

Marketplace `claude-design-skillstack` (`freshtechbro/claudedesignskills`, 22 skills + 5
bundles). Eight installed globally at user scope. These are **library manuals**, not design
authorities — they never conflict with `impeccable` or `design-taste-frontend`, so it is
safe to load one alongside whichever authority owns the project.

| Skill | Reach for it when |
|---|---|
| `gsap-scrolltrigger` | Scroll choreography — pinning, stacking, scrubbing — without `gpt-taste`'s design opinion attached. |
| `react-three-fiber` | Declarative 3D in React. The normal answer; already the stack in a football-fixtures site. |
| `spline-interactive` | Designer-made 3D, no code. Already used in an AI gifting product. |
| `blender-web-pipeline` | Blender → web export of models and animations. |
| `rive-interactive` | **The one to learn.** State-machine vector animation that reacts to hover, click and app state, at a fraction of Lottie's size. |
| `lottie-animations` | After Effects animations on the web. Use when the asset already exists as Lottie. |
| `animejs` | SVG and timeline work without GSAP's 1.8 MB. |
| `react-spring-physics` | Spring dynamics when a tween feels wrong. |

Not installed, deliberately: `modern-web-design` and `web3d-integration-patterns` are
meta-skills that overlap the design authorities in §1 and would muddy the "one authority
per project" rule. `motion-framer` duplicates the `motion` library already in use. The
remaining engine skills (`babylonjs-engine`, `playcanvas-engine`, `pixijs-2d`,
`aframe-webxr`, `substance-3d-texturing`, `locomotive-scroll`, `barba-js`,
`scroll-reveal-libraries`, `lightweight-3d-effects`, `animated-component-libraries`,
`threejs-webgl`) are one command away if a project needs them:

```bash
claude plugin install <name>@claude-design-skillstack
```

**Pinterest:** no good option installed and none worth installing yet. The available
community skills are thin (`postplusai/postplus-skills@pinterest-search`, ~380 installs).
`imagegen-frontend-web` and `brandkit` already produce reference boards, and Exa/Firecrawl
already fetch real sites. Revisit only if a genuine Pinterest workflow appears.

## 4. Simplification and review

| Skill | Choose it when |
|---|---|
| `ponytail` | **Before** building something elaborate. Forces the laziest thing that works: does this need to exist, is there a stdlib/native answer, one line before fifty. Levels: lite / full / ultra. |
| `ponytail-review` | Review a diff purely for over-engineering — what to delete. |
| `ponytail-audit` | Same, whole repo. |
| `ponytail-debt` | Collect `ponytail:` comments into a ledger so deferrals get tracked. |
| `/code-review` | Correctness bugs + cleanups on the current diff. `ultra` = cloud multi-agent. |
| `/security-review` | Security pass. |
| `full-output-enforcement` | The agent keeps truncating long files. |

## 5. Process

| Skill | Choose it when |
|---|---|
| `superpowers:brainstorming` | **Before any creative/build work.** Classifies spike / bounded / architectural, gates on approval. |
| `superpowers:writing-plans` | A spec exists, code hasn't started. |
| `superpowers:systematic-debugging` | Any bug hunt. |
| `superpowers:test-driven-development` | Tests should lead. |
| `e2e-playwright` | **Any web project with UI worth trusting.** Written 2026-09-04 from the a recent build build. Playwright setup, config, role-based selector strategy, flake elimination, and the traps that eat the first hour (Vite binds `localhost` not `127.0.0.1`; device profiles need `chromium-headless-shell`, which `install chromium` does not provide). Set up once per project, then every later change is cheaper to trust. Not for UI-less libraries or throwaway spikes. |
| `graphify` | Codebase questions when `graphify-out/graph.json` exists. Heavy to build — never build unasked. |
| `find-skills` | "Is there a skill for X?" |

## 6. MCP servers and connectors

| Server | Use for |
|---|---|
| **Three.js view** (`learn_threejs`, `show_threejs_scene`) | Render a scene inline in chat. Use it to *see* 3D — the browser pane throttles rAF and often can't. |
| **Context7** (`resolve-library-id` → `query-docs`) | Current API docs for any library. Use before guessing an API. |
| **Exa** / **Firecrawl** | Web search and fetch, papers, GitHub. |
| **Unsplash** | Stock photography search. |
| **Vercel / Netlify** | Deploys, build logs, runtime errors, analytics. |
| **Supabase** | Postgres, auth, edge functions, migrations. |
| **v0 / base44 / Lovable** | Generate a starting app. |
| **Figma** | Design context, screenshots, shaders, video export. |
| **Gamma** | Photoreal 2D image generation, decks. |
| **Hugging Face** | Model/dataset/space search, Spaces. Free tier = ZeroGPU queues. |
| **Canva** | Brand templates, design export. |
| **GitKraken** | Git operations. |
| **TypeUI** (`https://mcp.typeui.sh/mcp`, user scope) | 94 named visual directions with previews, spanning marketing + application + components. A **locked look**, so it replaces direction-finding rather than joining it. Finance-appropriate ones: Executive, Methodical, Blueprint, Atlas, Contemporan. Ignore the view counts, the popular entries (Paper, Bento, Neumorphism, Neobrutalism) are trend looks and wrong for trust products. Gives aesthetics, not product reasoning: dense-table legibility, semantic-colour reservation and flow UX still have to be designed on top. **Tool availability is flaky:** as of 2026-09-03 it shows in the connecting-servers list, then registers zero callable tools and does not appear as an installed connector, so the live browse cannot be invoked. Re-test with `ToolSearch "typeui"` before planning around it; the direction names above are enough to work from when it is down. |

**Needing OAuth before use:** GitHub, Notion, Linear, Slack, Asana, ClickUp, Monday,
Figma, Atlassian, Datadog, HubSpot, Intercom and ~30 more. Authorise in claude.ai
connector settings, or `/mcp` in an interactive terminal session. Non-interactive
sessions cannot run the OAuth flow — say so rather than pretending the capability exists.

---

## 7. The decision framework — run this at the start of a build

Do not just list what is installed. **Evaluate, recommend, and give the benefit.**

Work through these, then present a single structured question round with one
recommendation per row and a one-line reason:

1. **What kind of surface is this?** Marketing/landing (persuade) · app UI (operate) ·
   docs (read) · portfolio/gallery (experience). This picks the design authority and how
   much motion is appropriate.
2. **Greenfield or existing?** Existing → `redesign-existing-projects` or impeccable's
   audit path; never a greenfield direction roll over a working identity.
3. **Is the visual direction already decided?** Yes → a locked look (`minimalist-ui`,
   `industrial-brutalist-ui`) and skip direction-finding entirely. No → one authority
   from §1.
4. **Is there real content?** Real photos/copy/data beat anything generated. If content
   is missing, say what must be gathered and mark placeholders visibly — never invent
   commercial or factual claims.
5. **Does it need 3D?** Only where interactivity earns it (configurator, product viewer).
   If yes: real HDRI, and `img2threejs` if geometry looks basic and an object photo exists.
6. **Does it need video?** Separate deliverable → `remotion-*`. Website motion is not video.
7. **Simplification pass?** `ponytail` before building anything elaborate.
8. **Review + deploy.** `/code-review`, then the target: GitHub Pages (static, free),
   Vercel/Netlify (builds, functions), Supabase if it needs a backend.

Keep it to **one round**. State the tradeoff, not just the name. If a skill that clearly
fits is missing, say so and give the install command instead of working around it.

## 8. Install and maintenance

```bash
npx skills add <owner/repo> --global -y      # -g/--global, or it lands in the project
npx skills find <query>                      # search the registry
npx skills list                              # what is installed
npx skills update -g                         # update global skills
```

`npx skills add` without `--global` installs into `./.agents/skills` **inside the current
repo** — that has already polluted a client repo once. Always pass `--global` unless the
skill is genuinely project-specific.

**Keep this file current: whenever a skill or connector is added or removed, update it in
the same turn.**

## 9. Deploy notes that keep biting

- `localhost:*` is reachable **only on this machine**. Never send a client a localhost
  link. Publish, then send the public URL.
- GitHub Pages: `gh api -X POST repos/<owner>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"`,
  add `.nojekyll`, wait for `gh api repos/<owner>/<repo>/pages/builds/latest --jq .status`
  to reach `built`. It can sit in `building` for a long time; an empty commit retriggers it.
- Large binaries (HDRIs, vendored libs, photos) push the repo past a few MB and make
  Pages builds slow. Convert photos to WebP and downscale textures before committing.
