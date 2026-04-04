# Contributing

## Getting Started

1. Fork and clone the repository
2. Run `npm install`
3. Run `pre-commit install && pre-commit install --hook-type commit-msg`
4. Create a `.env.local` file with your Mapbox token: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx`
5. Run `npm run dev`

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass: `npm run lint && npx tsc --noEmit && npx vitest run`
4. Commit using conventional commits: `type: description`
5. Push and create a pull request

## Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `refactor`: Code refactoring
- `test`: Test additions or changes

## Code Standards

- TypeScript strict mode, no `any` types
- Functional React components only
- ESLint and Prettier must pass
- No hardcoded credentials or API keys
