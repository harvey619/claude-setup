# How I use Claude Code

**Rendered version:** https://claude.ai/code/artifact/61342597-cda5-4635-88d9-b67c8a510805

My working setup: the standing instructions, the tool inventory, the build
method, and one hook that stops me forgetting any of it.

I teach web development, so this doubles as the thing I hand students when they
ask "how do you actually work with this."

---

## The idea

Claude Code will happily start coding the moment you ask. That is usually the
wrong first move, and after enough projects I found the same three failures:

1. **I forget what I have installed.** Twenty-two design and animation skills is
   more than anyone holds in their head. The one you forget is the one you
   needed.
2. **The tool gets picked after the code is written**, when switching is
   expensive, instead of before, when it is free.
3. **Decisions go unrecorded.** Six weeks later nobody remembers why this project
   uses GSAP and that one uses CSS.

So this setup is four files and a hook that fix those three things, in order.

---

## What's here

| File | What it does |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Standing instructions loaded into **every** session. Short on purpose. |
| [`TOOLKIT.md`](TOOLKIT.md) | The inventory: every skill and connector I have, and a decision framework for picking between them. |
| [`WEB-PLAYBOOK.md`](WEB-PLAYBOOK.md) | The method: framework choice, database comparison, free AI tiers, version currency checks, a teaching order, and the traps that have actually cost me hours. |
| [`commands/newsite.md`](commands/newsite.md) | `/newsite` — runs the stack chooser on demand. |
| [`hooks/web-stack-chooser.mjs`](hooks/web-stack-chooser.mjs) | Fires the chooser automatically when a session opens in a new web project. |
| [`settings.example.json`](settings.example.json) | The settings that matter, with my machine-specific permissions stripped out. |

---

## The part worth stealing: the chooser

The problem with a reference document is that you have to remember to open it.

So the menu comes to me instead. When a session starts in a project that looks
**new**, a `SessionStart` hook injects a chooser and Claude asks, before writing
any code:

1. **Design authority** — pick exactly one, they conflict
2. **Motion** — multi-select, these compose
3. **3D** — only where interaction earns it
4. **Backend** — only if it needs one

Every option carries its **tradeoff**, not just its name. That is the whole
point: you can only make a real choice if the cost is on screen next to the
benefit. Smooth scroll comes with "breaks ⌘F and hurts screen readers". Three.js
comes with "565 KB, code-split it". Supabase comes with "turn on RLS the same day
or your table is public".

The answers get written to `.claude/stack.md` in that project, which records the
decision **and** switches the prompt off for that project forever.

### Making it quiet enough to survive

A prompt that nags gets disabled, so the detection is deliberately strict. It
fires only when a project is a real web project with **≤5 commits**, or a
greenfield directory that is already a git repo. Seven cases, all tested:

| Situation | Behaviour |
|---|---|
| Established repo | silent |
| Home directory | silent |
| New git repo, no `package.json` | **fires** |
| Fresh web project, 2 commits | **fires** |
| After `.claude/stack.md` exists | silent |
| `.claude/.no-stack-chooser` present | silent |
| Non-web Node project | silent |

Errors exit silently. A broken hook must never block a session.

---

## Install

```bash
git clone https://github.com/harvey619/claude-setup.git
cd claude-setup

cp CLAUDE.md TOOLKIT.md WEB-PLAYBOOK.md ~/.claude/
mkdir -p ~/.claude/commands ~/.claude/hooks
cp commands/newsite.md ~/.claude/commands/
cp hooks/web-stack-chooser.mjs ~/.claude/hooks/
```

Then merge `settings.example.json` into your own `~/.claude/settings.json` —
**merge, do not overwrite**, or you lose your existing permissions. The parts
that matter are `hooks`, `enabledPlugins` and `extraKnownMarketplaces`.

The design skills come from a separate marketplace:

```bash
claude plugin marketplace add freshtechbro/claudedesignskills
claude plugin install gsap-scrolltrigger@claude-design-skillstack
claude plugin install rive-interactive@claude-design-skillstack
# ...or browse: claude plugin marketplace list
```

Restart Claude Code afterwards.

---

## Opinions baked in, so you can disagree on purpose

- **One design authority per project.** They conflict; two produces contradictory
  rules for the same files.
- **Build 3D where interaction earns it.** Decorative 3D behind a hero reads as a
  crypto landing page and costs credibility on a serious product.
- **Native CSS scroll-driven animation before a scroll library.**
  `animation-timeline: view()` is baseline in 2026 and gets most of the feel with
  none of the accessibility cost.
- **An API key never reaches the browser.** `VITE_*` and `NEXT_PUBLIC_*` are
  public and ship inside the bundle.
- **Let the model write assumptions, never the answer.** An LLM that writes the
  number means you can never test the output. An LLM that writes the *inputs*,
  with pure functions computing the result, means you can test everything
  downstream.
- **Verify appearance, not that a component rendered.** "The section mounted" and
  "the page looks right" are different claims, and only one is what the user
  sees.

---

## For students

`WEB-PLAYBOOK.md` §10 is a teaching order, and the sequencing is the content:
hand-written HTML and CSS **once** before Tailwind hides it; React before Next,
because the server/client boundary is the hardest idea in modern web development;
row-level security taught the same day as the database, or they ship a public
one. Animation and 3D come last — a student who reaches for 3D before they can
lay out a form builds something impressive-looking and unusable.

It ends with six questions for marking a project:

1. Does it work on a phone?
2. Can you use it with only a keyboard?
3. What happens on a slow connection, and on failure?
4. Is there a real empty state, or does it show `[]`?
5. Are the secrets on the server?
6. Would a stranger know what it does in five seconds?

---

## Honest caveats

- Model pricing and free-tier limits in `WEB-PLAYBOOK.md` move fast. Re-check
  every six months; the file says so in its own footer.
- `TOOLKIT.md` lists **my** installed skills. Yours will differ — treat it as a
  worked example of the format, not a shopping list.
- The version currency table is accurate as of **September 2026**.
