import assert from 'node:assert';
// #10048: importing the built entry must not throw. The used indirect re-export
// retains theming.js's helper calls, so helpers.js must remain reachable too;
// otherwise this import throws `ReferenceError: __commonJS is not defined`.
import { getProjectAnnotations } from './dist/entry.js';

assert.deepStrictEqual(getProjectAnnotations(), [
  {
    light: { base: 'light', appBg: '#ffffff' },
    dark: { base: 'dark', appBg: '#000000' },
  },
]);
