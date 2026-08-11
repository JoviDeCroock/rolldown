import { common } from './common.js';
import { c1 } from './c1.js';
import { c2 } from './c2.js';
import { c3 } from './c3.js';

const routes = [() => import('./r1.js'), () => import('./r2.js'), () => import('./r3.js')];

// The entry has no exports on purpose: an entry chunk with its own exports is a
// different merge case (`preserveEntrySignatures`). It hands the routes to the test
// through `globalThis` instead.
console.log([common, c1, c2, c3].join('|'));
globalThis.fixtureLoadRoute = (route) => routes[route - 1]();
