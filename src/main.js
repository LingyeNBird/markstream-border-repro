// Setup exactly as documented for non-Tailwind projects: a reset first, then the precompiled index.css.
import 'modern-css-reset'
import 'markstream-vue/index.css'
import './page.css'
import { createApp } from 'vue'
import { enableMermaid } from 'markstream-vue'
import App from './App.vue'

enableMermaid(() => import('mermaid'))
createApp(App).mount('#app')
