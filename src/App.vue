<script setup>
import { nextTick, onMounted, ref } from 'vue'
import MarkdownRender from 'markstream-vue'

const markdown = `\`\`\`mermaid
flowchart LR
  A[Start] --> B[End]
\`\`\`

\`\`\`js
console.log('hello')
\`\`\`

Text with a footnote.[^1]

---

[^1]: The footnote.
`

// Elements whose border should be visible; an arrow points at each one in the "as documented" column.
const TARGETS = [
  { selector: '.mermaid-block-header', edge: 'bottom', label: 'no header line (.border-b)' },
  { selector: '.mermaid-block-container', edge: 'middle', label: 'no outline (.border)' },
  { selector: '.code-block-container > :first-child', edge: 'bottom', label: 'no header line (.border-b)' },
  { selector: '.footnote-node', edge: 'top', label: 'no footnote line (.border-t)' },
  { selector: '.hr-node', edge: 'middle', label: '<hr> is browser inset' }
]

const column = ref(null)
const arrows = ref([])

/** Place an arrow next to each target in the left column. */
function placeArrows() {
  const root = column.value
  if (!root) return
  const box = root.getBoundingClientRect()
  arrows.value = TARGETS.flatMap(({ selector, edge, label }) => {
    const el = root.querySelector(selector)
    if (!el) return []
    const r = el.getBoundingClientRect()
    const y = edge === 'top' ? r.top : edge === 'middle' ? r.top + r.height / 2 : r.bottom
    return [{ label, top: y - box.top, left: r.right - box.left }]
  })
}

onMounted(async () => {
  await nextTick()
  // Mermaid and the code block render asynchronously; re-place arrows as the layout settles.
  new ResizeObserver(placeArrows).observe(column.value)
  for (const delay of [300, 1000, 2500]) setTimeout(placeArrows, delay)
})
</script>

<template>
  <main>
    <h1>markstream-vue: borders missing without Tailwind preflight</h1>
    <p class="intro">
      Both columns import <code>modern-css-reset</code> then <code>markstream-vue/index.css</code> (markstream-vue 2.0.24, no
      Tailwind/UnoCSS), as documented for non-Tailwind projects. <code>index.css</code> sets border widths but never
      <code>border-style</code>, so these borders are not drawn. The right column adds only:
    </p>
    <pre class="fix">
:where(.markstream-vue) :where(.border)   { border-style: solid; }
:where(.markstream-vue) :where(.border-t) { border-top-style: solid; }
:where(.markstream-vue) :where(.border-b) { border-bottom-style: solid; }
.hr-node { border-style: solid none none; }</pre
    >
    <div class="columns">
      <section>
        <h2>As documented</h2>
        <div ref="column" class="column">
          <MarkdownRender :content="markdown" />
          <div
            v-for="arrow in arrows"
            :key="arrow.label"
            class="arrow"
            :style="{ top: `${arrow.top}px`, left: `${arrow.left}px` }"
          >
            <span class="arrow-head">◀</span><span class="arrow-label">{{ arrow.label }}</span>
          </div>
        </div>
      </section>
      <section>
        <h2>With the border styles above added</h2>
        <div class="column with-fix">
          <MarkdownRender :content="markdown" />
        </div>
      </section>
    </div>
  </main>
</template>
