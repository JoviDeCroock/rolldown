import assert from 'node:assert/strict';
import fs from 'node:fs';

await import('./dist/main.js');

const r1 = await globalThis.fixtureLoadRoute(1);
assert.equal(r1.default(), 'r1:common-base:c1:common-base');

const r2 = await globalThis.fixtureLoadRoute(2);
assert.equal(r2.default(), 'r2:c1:common-base:c2:c1:common-base');

const r3 = await globalThis.fixtureLoadRoute(3);
assert.equal(r3.default(), 'r3:c2:c1:common-base:c3:c2:c1:common-base');

// The layout assertion only holds for the default config: the extended
// `preserveEntrySignatures` rounds keep the shared modules out of the entry chunk on purpose.
if (!globalThis.__configName) {
  const distDir = new URL('./dist/', import.meta.url);
  const jsFiles = fs
    .readdirSync(distDir)
    .filter((file) => file.endsWith('.js'))
    .sort();

  assert.deepEqual(
    jsFiles,
    ['main.js', 'r1.js', 'r2.js', 'r3.js'],
    `main.js executes every shared module before any route is imported, so no common chunk should survive; got ${jsFiles.join(', ')}`,
  );
}
