# Lazy pure indirect re-export

A pure barrel written as `import {value}; export {value}` remains lazy when one forwarded binding is requested. A pure bare import may be checked independently, but requesting `used` must not load the unrelated `deferred.js` module or resolve its deliberately missing dependency.
