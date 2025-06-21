# Contributing to ViqiumAI Backend

Thank you for contributing! As a global team, standardizing our workflow is critical to moving fast without breaking things.

## Branching Strategy

We follow GitHub Flow:
- **`main`**: The production-ready code.
- **Feature Branches**: Create branches off `main` for new features or bug fixes.
  - Prefix with `feature/` (e.g., `feature/user-auth`)
  - Prefix with `fix/` (e.g., `fix/login-crash`)
  - Prefix with `chore/` (e.g., `chore/update-deps`)

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/).
Format: `<type>(<optional scope>): <description>`
Examples:
- `feat(auth): add google login endpoint`
- `fix(chatbot): handle missing API keys gracefully`
- `docs: update setup instructions`

## Code Standards

Before committing, ensure your code passes our linting and formatting rules. 
- Husky will automatically run `lint-staged` (ESLint + Prettier) on your staged files when you run `git commit`.
- If the pre-commit hook fails, fix the errors and try committing again.
- Avoid using `any` in TypeScript where possible.

## Pull Requests

1. Push your branch to the repository.
2. Open a Pull Request against `main`.
3. Use the provided PR template.
4. Ensure CI checks pass.
5. Request a review from at least one team member.
