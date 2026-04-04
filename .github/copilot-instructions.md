# Copilot Code Review Instructions

## Priorities

1. **TypeScript**: Strict typing, no `any`, no type assertions without justification
2. **React**: Functional components only, proper hooks usage, accessibility (ARIA, keyboard nav)
3. **Next.js**: Correct Server vs Client Component usage, proper data fetching patterns
4. **Security**: No hardcoded secrets, no `eval()`, proper input validation at boundaries
5. **Performance**: Avoid unnecessary re-renders, proper memoization, lazy loading for heavy components

## Conventions

- Conventional commits: `type: description`
- No AI attribution watermarks
- ESLint and Prettier must pass
- All code in `src/` directory
