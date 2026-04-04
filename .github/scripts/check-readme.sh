#!/usr/bin/env bash
set -euo pipefail

echo "Checking README quality..."
errors=0

if [ ! -f "README.md" ]; then
  echo "ERROR: README.md not found"
  exit 1
fi

for section in "## " "License" "Setup" "Features"; do
  if ! grep -q "$section" README.md; then
    echo "WARNING: README missing section containing '$section'"
    errors=$((errors + 1))
  else
    echo "Section '$section' found"
  fi
done

LINE_COUNT=$(wc -l < README.md | tr -d ' ')
if [ "$LINE_COUNT" -lt 20 ]; then
  echo "WARNING: README.md has only $LINE_COUNT lines (expected 20+)"
  errors=$((errors + 1))
fi

if [ "$errors" -gt 0 ]; then
  echo "$errors README quality warnings"
  exit 1
fi

echo "README quality check complete"
