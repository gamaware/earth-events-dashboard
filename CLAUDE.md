# CLAUDE.md - Project Instructions for Claude Code

This file is automatically loaded into context when Claude Code starts a conversation
in this repository. It defines the conventions, rules, and structure that must be followed.

## Repository Overview

Earth Events Dashboard - a Next.js application that visualizes real-time natural events
using the NASA EONET (Earth Observatory Natural Event Tracker) API. Built with TypeScript,
Tailwind CSS, shadcn/ui, and MapLibre GL JS.

## Repository Structure

```text
src/
  app/                  # Next.js App Router pages, layouts, and API routes
  components/           # React components (layout, map, filters, events, stats, ui)
  lib/                  # Utility functions, API clients, types, constants, hooks
  __tests__/            # Unit tests (vitest)
public/                 # Static assets
docs/
  adr/                  # Architecture Decision Records
.claude/
  settings.json         # Claude Code hooks configuration
  hooks/                # Post-edit formatters
.github/
  workflows/            # CI/CD (quality-checks, ci, security, update-pre-commit-hooks)
  actions/              # Composite actions (security-scan, update-pre-commit)
  scripts/              # Validation scripts
  ISSUE_TEMPLATE/       # Bug report and feature request templates
  PULL_REQUEST_TEMPLATE.md
  copilot-instructions.md
  dependabot.yml
```

## Git Workflow

### Commits

- Conventional commits required: `type: description`
- Types: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`
- Never commit directly to `main` - enforced by `no-commit-to-branch` hook
- Always work on a feature branch and create a PR
- Do NOT add `Co-Authored-By` watermarks or any Claude/AI attribution. Ever.

### Pull Requests

- All changes go through PRs
- Squash merge only
- CodeRabbit and GitHub Copilot auto-review all PRs
- All required status checks must pass before merge

## Pre-commit Hooks

Install: `pre-commit install && pre-commit install --hook-type commit-msg`

### Hooks in use

- General: trailing-whitespace, end-of-file-fixer, check-yaml, check-json,
  check-added-large-files (1MB), check-merge-conflict, detect-private-key,
  check-executables-have-shebangs, check-shebang-scripts-are-executable,
  check-symlinks, check-case-conflict, no-commit-to-branch (main)
- Secrets: detect-secrets (with `.secrets.baseline`), gitleaks (`--redact`)
- Shell: shellcheck (`--severity=warning`), shellharden (`--check`)
- TypeScript/JavaScript: Prettier (TS/TSX/JS/JSX/CSS/JSON), ESLint (TS/TSX/JS/JSX)
- Markdown: markdownlint with `--fix`
- GitHub Actions: actionlint, zizmor
- Commits: conventional-pre-commit (commit-msg stage)

## CI/CD Pipelines

### ci.yml

| Job | Tool |
| --- | --- |
| install | npm ci with cache |
| lint | eslint |
| type-check | tsc --noEmit |
| test | vitest run |
| build | next build |

### quality-checks.yml

| Job | Tool |
| --- | --- |
| markdown-lint | markdownlint-cli2 |
| link-checker | markdown-link-check |
| yaml-lint | yamllint |
| file-structure | validate-structure.sh |
| readme-quality | check-readme.sh |
| actions-security | zizmor |
| shell-check | shellcheck |

### security.yml

Semgrep SAST + Trivy SCA via `.github/actions/security-scan` composite action.

### update-pre-commit-hooks.yml

Weekly auto-update via PR.

## Claude Code Hooks

- Post-edit (`post-edit.sh`): Uses `$TOOL_INPUT_FILE_PATH` to auto-format after Edit/Write
  - `.sh`: shellharden --replace + chmod +x
  - `.md`: markdownlint --fix
  - `.ts/.tsx/.js/.jsx/.css`: npx prettier --write

## Linting Policy

### Absolute rule: NO suppressions on our own code

- Fix violations, never suppress them
- Markdownlint: MD013 line length 120, tables exempt

## TypeScript / React Guidelines

- Strict TypeScript (`strict: true` in tsconfig.json)
- Functional components only, no class components
- Use the App Router (`src/app/`), not the Pages Router
- Server Components by default; add `"use client"` only when needed
- No `any` types - use proper typing or `unknown`
- No `eval()` or `implied-eval`

## MapLibre GL

- No API token needed (free, open-source)
- Map initialized with globe projection and dark style
- Use raw `maplibre-gl` (not react-map-gl) for full API access
- Map instance shared via React context (MapProvider)

## Markdown

- Line length limit: 120 characters (MD013)
- Tables exempt from line length
- Table separator: `| --- |` with spaces
- Use ATX headings (`#`), not bold text as headings
- Fenced code blocks must specify a language

## Security

- Never commit secrets, credentials, private keys, or `.env` files
- `.gitignore` excludes: `.env`, `.env.local`, `*.pem`, `*.key`, `credentials.json`
