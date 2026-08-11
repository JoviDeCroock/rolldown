# Common chunk merge unblocked by other merges

Reproduction of [#9963](https://github.com/rolldown/rolldown/issues/9963): a common
chunk that the entry itself executes is left standing next to the entry chunk.

## Graph

`common → c1 → c2 → c3` is a "staircase" of shared modules. The entry eagerly uses
the whole staircase and lazily imports three routes, each using an adjacent pair:

```text
main ── static ──> common, c1, c2, c3
  ├─ import() r1 ─> common, c1
  ├─ import() r2 ─> c1, c2
  └─ import() r3 ─> c2, c3
```

The overlapping subsets give the shared modules three distinct dependent-entry sets,
so chunk optimization sees three separate common-chunk candidates:
`{common, c1}`, `{c2}`, `{c3}`.

## Expected layout

Four chunks — `main.js` plus one per route. Every route is dynamically imported by
`main`, so `main` always ran first and can absorb all three candidates.

## What this pins

The candidates are considered in one order, and at that moment
`{common, c1} → main` closes a chunk cycle (`main → c3-chunk → c2-chunk →
main`). Folding `{c3}` and then `{c2}` into `main` removes those intermediate
chunks, which retires the cycle — so `{common, c1}` has to be retried rather than
written off after a single pass. See
`internal-docs/code-splitting/implementation.md`.
