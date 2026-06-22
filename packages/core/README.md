# @lexgrade/core

The shared, dependency-free parsing core for the open [LexGrade Standard](https://lexgrade.org).

It holds the **one** Technique Register parser — `parseTechniques`,
`parseTechniqueFields`, and `slugifyTechnique` — imported by both the
lexgrade.org site build and the [`@lexgrade/mcp`](../mcp) server, so technique
slugs, the standardized field model, and the split logic cannot drift between
surfaces.

Pure functions, no filesystem, no dependencies.

```js
import { parseTechniques } from '@lexgrade/core';

const techniques = parseTechniques(registerMarkdown);
// → [{ number, name, slug, category, tier, definition, fields, body }, …]
```

Licensed AGPL-3.0-only. © 2026 LexGrade.
