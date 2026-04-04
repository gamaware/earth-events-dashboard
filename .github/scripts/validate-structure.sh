#!/usr/bin/env bash
set -euo pipefail

echo "Checking repository structure..."
errors=0

for file in LICENSE README.md .gitignore CLAUDE.md CODEOWNERS \
  CONTRIBUTING.md SECURITY.md package.json tsconfig.json; do
  if [ ! -f "$file" ]; then
    echo "ERROR: $file missing"
    errors=$((errors + 1))
  else
    echo "$file found"
  fi
done

for dir in src/app src/components src/lib .github/ISSUE_TEMPLATE docs; do
  if [ ! -d "$dir" ]; then
    echo "ERROR: $dir/ directory missing"
    errors=$((errors + 1))
  else
    echo "$dir/ found"
  fi
done

if [ "$errors" -gt 0 ]; then
  echo "$errors required files/directories missing"
  exit 1
fi

echo "Repository structure validation complete"
