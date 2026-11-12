# Vendored fonts

The build-time Open Graph cards (`src/og.mjs`) render in the same serif the
site loads from Google Fonts, vendored here so the build never depends on the
network or system fonts. Static instances, unmodified from upstream.

| File | Upstream | License |
|------|----------|---------|
| `SourceSerif4Display-Semibold.ttf`, `SourceSerif4-Semibold.ttf`, `SourceSerif4-Regular.ttf` | [adobe-fonts/source-serif](https://github.com/adobe-fonts/source-serif) (`release/TTF`) | SIL OFL 1.1 · [OFL-SourceSerif4.md](OFL-SourceSerif4.md) |
| `NotoNaskhArabic-SemiBold.ttf`, `NotoNaskhArabic-Regular.ttf` (the Arabic cards) | [notofonts/arabic](https://github.com/notofonts/arabic) (`hinted/ttf`) | SIL OFL 1.1 · [OFL-NotoNaskhArabic.txt](OFL-NotoNaskhArabic.txt) |
