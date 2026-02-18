# Document

Review the current session and update project documentation with anything new or changed.

## Steps

### 1. Gather context
Read these files to understand current state:
- `CLAUDE.md` in the project root (if it exists)
- The project's MEMORY.md in `~/.claude/projects/` (find the correct path for this project)
- Any other key config or source files relevant to recent changes

### 2. Identify what changed this session
Review the git diff and recent conversation to find:
- New or changed configuration, code patterns, or conventions
- New files or structural changes
- Process lessons learned (things that broke, workarounds discovered)
- New tools, integrations, or workflow changes
- Changes to skills or slash commands

### 3. Update CLAUDE.md
For each change found, update the relevant section. Add new sections only if the change doesn't fit existing ones.

Do NOT:
- Rewrite sections that haven't changed
- Add speculative documentation for things not yet implemented
- Remove existing documentation unless it's clearly wrong

### 4. Update MEMORY.md
Add entries to the project's MEMORY.md for:
- Process lessons that would prevent repeating mistakes
- Workflow preferences confirmed by the user
- Key paths or configurations that are easy to forget

Keep MEMORY.md under 200 lines. Remove outdated entries if needed.

### 5. Report
Tell the user what was updated, as a short bulleted list of changes made to each file.
