# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.


## Context Navigation
When you need to understand a codebase, docs, or files in the current project:

1. First check whether `graphify-out/graph.json` exists in the project root.
   - **If it exists**, query it before reading files: `graphify query "your question"`
     (also `graphify path "EntityA" "EntityB"` and `graphify explain "Concept"`).
     Queries only work from the directory that was graphed — `cd` there first.
   - **If it does not exist**, just read the files normally. Do NOT build a graph
     with `/graphify .` unless I ask — it is a heavy operation.
2. When a graph exists, prefer it for "how does X work" and "what connects to Y"
   questions. Still read raw files to confirm specifics, when the graph looks stale
   (check the date in `GRAPH_REPORT.md`), or whenever I say "read the file".
3. `graphify-out/wiki/index.md` exists ONLY if the graph was built with
   `/graphify . --wiki`. Use it as a browsing entrypoint when present; otherwise use
   `graphify-out/GRAPH_REPORT.md`.

# Toolkit — read this before starting any build

`~/.claude/TOOLKIT.md` is the inventory of every skill, MCP server and connector I have,
**plus a decision framework in section 7**. I will not remember what is installed.
Do not make me name things, and do not just list them back at me.

At the start of any new site, app, or substantial coding project:

1. Read `~/.claude/TOOLKIT.md`, including section 7.
2. Work through the framework's eight questions against THIS project.
3. Present ONE structured question round: for each decision that matters here — design
   authority, locked look vs direction-finding, 3D, video, simplification, review, deploy
   target — give a recommendation, the concrete benefit, and the tradeoff. Not a catalogue:
   a short list of real choices with reasons.
4. Only one design authority per project. `impeccable`, `design-taste-frontend`,
   `gpt-taste` and `redesign-existing-projects` conflict — pick one and say which.
5. If a skill that clearly fits is missing, say so and give me the install command rather
   than working around it. Always `--global` unless it is genuinely project-specific.

Skip the menu for one-off questions, tiny fixes, and non-build work.

Keep `TOOLKIT.md` current: whenever a skill or connector is installed or removed, update
it in the same turn.
