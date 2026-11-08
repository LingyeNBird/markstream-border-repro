# markstream-vue: borders missing without Tailwind preflight

Live page: https://<user>.github.io/markstream-border-repro/

Minimal setup as documented for non-Tailwind projects: `modern-css-reset`, then `markstream-vue/index.css` (2.0.24), no Tailwind/UnoCSS.
`index.css` sets border widths (`.border`, `.border-t`, `.border-b`, `.hr-node`) but never `border-style`, so the left column draws
no header lines, outlines or footnote line, and `<hr>` falls back to the browser's `inset` style. The right column adds only:

```css
:where(.markstream-vue) :where(.border)   { border-style: solid; }
:where(.markstream-vue) :where(.border-t) { border-top-style: solid; }
:where(.markstream-vue) :where(.border-b) { border-bottom-style: solid; }
.hr-node { border-style: solid none none; }
```

Run locally: `pnpm install && pnpm dev`.
