---
title: Slash command not appearing in Claude Code due to project scope and working directory
date: 2026-02-10
category: integration-issues
tags:
  - claude-code
  - slash-commands
  - project-configuration
  - working-directory
  - sanity-studio
component: Claude Code command discovery and execution
severity: medium
symptoms:
  - "/sanity slash command not visible in Claude Code"
  - "Command works in one project but not another despite identical file structure"
  - "npx sanity dev fails when executed from project root instead of sanity-studio/"
root_cause: "Project-scoped .claude/commands/ only load when Claude Code starts from project directory, and command used incorrect working directory context for sanity-studio"
---

# Slash Command Not Appearing in Claude Code

## Problem

The `/sanity` slash command was not appearing in Claude Code when working on the nextjs-blog project. The command file existed at `.claude/commands/sanity.md` but was invisible to Claude Code.

## Symptoms

- `/sanity` not listed as an available slash command
- Command existed in `.claude/commands/sanity.md` and worked in another project (marcus-berley-therapy)
- When manually executing the command logic, `npx sanity dev` failed with: *"Command 'dev' is not available outside of a Sanity project context"*

## Root Cause

**Two issues compounded:**

1. **Claude Code was launched from `~` (home directory)** instead of the project root. The `.claude/commands/` directory is project-scoped — commands only load when Claude Code starts from within that project directory.

2. **The command referenced `sanity dev` without proper path context.** The Sanity Studio lives in a `sanity-studio/` subdirectory, so `npx sanity dev` fails when run from the project root because there's no `sanity.config.ts` in the root.

## Solution

### Part 1: Launch Claude Code from the project root

```bash
z nextjs-blog   # navigate with zoxide
claude           # launch CC — .claude/commands/ now loads
```

### Part 2: Update the command to handle paths correctly

Updated `.claude/commands/sanity.md` to use `npm --prefix` for explicit path targeting and added browser auto-open:

**Before:**
```markdown
Launch Sanity Studio for content editing.

Steps:
1. Start Sanity Studio with `sanity dev` from the `sanity-studio/` directory in the background
2. Wait for the server to be ready on localhost:3333
3. Confirm to the user that Sanity Studio is running at http://localhost:3333/

If Sanity Studio is already running (port 3333 in use), skip starting it and just tell the user it's already available.
```

**After:**
```markdown
Launch Sanity Studio for content editing.

Steps:
1. Check if port 3333 is already in use. If so, skip to step 4.
2. Start Sanity Studio with `npm --prefix <project-root>/sanity-studio run dev` in the background
3. Wait for the server to be ready on localhost:3333
4. Open the browser with `open http://localhost:3333`
5. Confirm to the user that Sanity Studio is running
```

**Key improvements:**
- `npm --prefix` eliminates Sanity CLI context errors
- Port check prevents duplicate server instances
- Browser auto-open removes manual navigation

## Prevention Strategies

- **Always launch Claude Code from the project root** — project-scoped commands, configs, and rules in `.claude/` only load from the correct directory
- **Use `npm --prefix` pattern** in commands that target subdirectory packages (like `sanity-studio/`) instead of relying on `cd` or shell context
- **Check port before starting** to avoid duplicate server instances

## Related Documentation

- **CLAUDE.md** (this project): Documents Sanity Studio commands under the Commands section (`cd sanity-studio && npm run dev`)
- **marcus-berley-therapy** `.claude/commands/sanity.md`: Uses simpler `npx sanity dev` pattern that assumes correct CWD — works there because Sanity is at the project root
- **`.claude/commands/preview.md`** (this project): Another project-scoped command that would have the same scoping behavior

## Cross-References

- Shell environment note in MEMORY.md: User has `zoxide` with `cd` hook that causes issues — use `npm --prefix` workaround
