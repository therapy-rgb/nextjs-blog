---
name: ship
description: Validate build, update documentation, commit, and push to GitHub
disable-model-invocation: true
argument-hint: [optional commit message]
---

# Ship to Production

Run the full pre-push workflow. Stop immediately if any step fails.

## Steps

### 1. Validate build
```bash
npm run build
```
If the build fails, fix the errors before continuing.

### 2. Validate lint
```bash
npm run lint
```

### 3. Validate tests
```bash
npm run test
```

### 4. Update documentation
- Check if any changes in this session warrant a README.md update (new pages, components, dependencies, env vars, scripts, or structural changes). Skip for trivial changes (bug fixes, style tweaks, content updates).
- Update `src/app/CLAUDE.md` if page behavior changed.

### 5. Commit
- Stage all relevant changed files (do not stage `.env*`, credentials, or large binaries).
- Write a concise commit message. If $ARGUMENTS was provided, use it as the message. Otherwise auto-generate from the diff.
- Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` in the commit.

### 6. Push
```bash
git push origin main
```
Confirm the push succeeded and display the commit hash.

### 7. Summary
Report what was shipped: commit hash, files changed, and remind that Vercel will auto-deploy from main.
