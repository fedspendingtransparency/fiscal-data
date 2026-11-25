# Fiscal Data – Claude Instructions

Gatsby + React site for fiscaldata.treasury.gov. Mixed JS/JSX and TS/TSX, SCSS modules, Jest + React Testing Library.

The full team style guide is in @style-guide.md. The rules below are the ones that matter most day to day.

## The main rule: match the code around you

Before writing anything, look at the neighboring files in the same folder and copy their patterns: file layout, naming,
imports, how state and fetching are handled, how tests are structured. Consistency with the existing code matters more
than what you think is "best practice."

- Don't introduce new libraries, state managers, styling approaches, or abstractions without being asked.
- Don't refactor, rename, reformat, or "clean up" code outside the scope of the task.
- Don't add clever or unusual constructs (generics gymnastics, HOCs, custom hook factories, class components,
  render props, barrels/index re-exports) where a plain function or component does the job.
- Keep diffs small. If a change touches unrelated files, stop and explain why.

## Code style

Prettier and ESLint are the source of truth. Run them; don't hand-format.

- 2-space indent, semicolons, 150-char lines, ES5 trailing commas, LF line endings.
- Single quotes in JS/TS; double quotes for JSX attributes.
- Functional components only, written as arrow function expressions (`const Foo = () => {}`), not `function Foo()`.
- Single-parameter arrow functions have no parentheses: `rows => ...`.
- Component order: hooks (`useState`, custom hooks) → local variables → local functions → `useEffect` → `return`.
- Destructure props.
- Prefer named exports for helpers; the component itself is the `export default` at the bottom of the file.
- `console.log` is for local debugging only. Use `console.info` / `console.warn` / `console.error` for anything
  that stays in the code.
- Prefix intentionally unused vars/args with `_`.

## TypeScript

- New components go in `.tsx`. Don't convert existing `.jsx` files to TypeScript unless asked.
- Components are typed `const Foo: FunctionComponent<FooProps> = ({ ... }) => { ... }` (imported from `react`).
- Component-local prop types live in the component file. Interfaces shared across components go in
  `src/models/` as `I<Name>.ts`.
- Avoid `any`; if you must use it, keep it narrow.
- Don't add prop-types to new components.

## Files and folders

- kebab-case for file and folder names: `my-component/my-component.tsx`.
- A component's styles and tests sit next to it:
  `my-component.tsx`, `my-component.module.scss`, `my-component.spec.js` (or `.spec.tsx`).
- Styles are SCSS modules imported with named imports:
  `import { container, title } from './my-component.module.scss';`
- Use the shared values in `src/variables.module.scss` instead of hardcoded colors, font sizes, or breakpoints.
- Use existing helpers before writing new ones: `src/utils/` (`api-utils`, `date-utils`, `rounding-utils`),
  `src/helpers/`, `src/hooks/`.
- API calls go through `basicFetch` / `apiPrefix` from `src/utils/api-utils`.
- GraphQL queries (`useStaticQuery`, page `query`) live in their own file, one query per file.

## Tests

- Jest + React Testing Library. Test files are `*.spec.js` / `*.spec.tsx` next to the component.
- Use `data-testid` only when there's no accessible role or text to query by.
- Mock fetches the way neighboring specs do (`fetch-mock` / `jest-fetch-mock`, data in `src/utils/mock-utils*`).
- Target: every changed file at 93%+ coverage.
- When a value comes from the API, render `--` as the placeholder while it's loading or missing (matches existing
  explainer pages).

## Accessibility

- `jsx-a11y` rules are enforced. Use semantic elements, `alt` text, labels, and keyboard-reachable controls.
- Don't introduce new axe violations.

## Commands

```
npm run develop-dev                     # local dev server
npx jest path/to/folder --silent        # run tests for what you changed
npm run test:branch                     # tests changed since master, with coverage
npx eslint path/to/file                 # lint
npx prettier --write path/to/file       # format
npm run type-check                      # tsc --noEmit
```

Before saying a change is done: run the relevant tests, ESLint, and Prettier on the files you touched.

## Git and PRs

- Branches are named after the Jira ticket: `FDG-12345`.
- Don't commit, push, or open PRs unless asked.
- PRs follow `pull_request_template.md`: link the Jira ticket and fill out the checklist.
- Don't change `package.json` / `package-lock.json` unless the task is about dependencies. The repo installs with
  `--legacy-peer-deps`; prefer adding a direct dependency over adding an `overrides` entry.

## Don't touch

- `.env` and other secrets. Never print or commit their values.
- Generated output: `public/`, `.cache/`, `coverage/`, `*.scss.d.ts`.
