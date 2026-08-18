# Tests — Shadesmar Companion

## Structure

```
src/
├── test/
│   ├── setup.ts           — Setup global
│   ├── smoke.test.ts      — Smoke test infrastructure
│   └── README.md          — This file
├── core/
│   └── <module>/
│       └── __tests__/     — Unit tests
└── components/
    └── <component>/
        └── __tests__/     — React render tests
```

## Fundamental rule

Every module in `src/core/` must have 100% coverage. These modules are the core of the product. A module in `src/core/` without test coverage is not ready to be committed.

## Conventions

Test files follow exactly the same rules as the rest of `src/` :

| Convention  | Rule                                                             |
| ----------- | ---------------------------------------------------------------- |
| Quote style | Single quotes `'` (Prettier — `singleQuote: true`)               |
| Semicolons  | None (Prettier — `semi: false`)                                  |
| Suffix      | `.test.ts`, **never** `.spec.ts`                                 |
| Placement   | Always in a `__tests__/` directory adjacent to the tested module |
| Naming      | `<module>.test.ts` — ex. `spoilerFilter.test.ts`                 |

### Globals available without import

The `globals: true` config in `vite.config.ts` + `/// <reference types="vitest/globals" />`
in `src/vite-env.d.ts` make these symbols available everywhere in `src/` :

```typescript
// ✅ No need to import describe, it, expect, vi, beforeEach, afterEach
describe('EntityStore', () => {
  it('returns empty array when no entities match position', () => {
    // ...
  })
})
```

### Intentionally ignored parameter: pattern `^_`

```typescript
// ✅ Correct — the _ prefix signals "intentionally ignored" to OxLint
const handler = (_event: Event) => doSomething()

// ❌ Forbidden — OxLint throws an error (typescript/no-unused-vars)
const handler = (event: Event) => doSomething()
```

## Run tests

```bash
pnpm test                # Once — usage CI
pnpm run test:watch      # Watch mode — usage development
pnpm run test:coverage   # Coverage report (lcov + text)
```
