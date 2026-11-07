# Vendored fonts

The build-time Open Graph cards (`src/og.mjs`) render in the same serif the
site serves, vendored here so the build never depends on the network or system
fonts. Static instances, unmodified from upstream.

The site's own webfonts are in `web/`, copied to `/fonts/` by the build. They're
the WOFF2 subsets Google Fonts served on 2026-11-06, named by content hash so
they can be cached permanently. The `@font-face` rules are at the top of
`src/styles.css`. If you replace a file, its name changes, so update those rules
and the preloads in `src/render.mjs`.

| File | Upstream | License |
|------|----------|---------|
| `SourceSerif4Display-Semibold.ttf`, `SourceSerif4-Semibold.ttf`, `SourceSerif4-Regular.ttf` | [adobe-fonts/source-serif](https://github.com/adobe-fonts/source-serif) (`release/TTF`) | SIL OFL 1.1 · [OFL-SourceSerif4.md](OFL-SourceSerif4.md) |
| `web/source-serif-4-*.woff2` | [Source Serif 4 on Google Fonts](https://fonts.google.com/specimen/Source+Serif+4) | SIL OFL 1.1 · [web/OFL-SourceSerif4.md](web/OFL-SourceSerif4.md) |
| `web/ibm-plex-*.woff2` | [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) and [Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) on Google Fonts | SIL OFL 1.1 · [web/OFL-IBMPlex.txt](web/OFL-IBMPlex.txt) |
