// Like @vueless/storybook-dark-mode: it uses only the helper-independent
// `themes` passthrough. Since theming.js forwards it through a local import,
// evaluating that used indirect re-export also evaluates theming.js's body.
import { themes } from './theming.js';

globalThis.__themes = themes;

export function getProjectAnnotations() {
  return [globalThis.__themes];
}
