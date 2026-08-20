// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Nuxt builds these component names from the directory, not the filename:
  // routes, layouts, and the `index.vue` entry of a component directory —
  // blökkli blocks and entity components are named by that convention.
  files: ['**/pages/**', '**/layouts/**', '**/components/**/index.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
  .override('nuxt/vue/rules', {
    rules: {
      // Prettier writes void elements self-closing; without this the autofix
      // and the formatter keep undoing each other.
      'vue/html-self-closing': ['warn', { html: { void: 'always' } }],
      // Kebab-case in templates is the Vue style guide's recommendation and
      // the preset default, but the preset only warns — and the lint job does
      // not block on warnings, so nothing would stop the convention drifting.
      //
      // `blokkliData` is exempt: it is not a declared prop on the
      // presentational components, it is a fallthrough attribute they read
      // back by name through `useAttrs()`, whose keys keep the casing written
      // in the template. Hyphenating it makes the lookup return undefined.
      'vue/attribute-hyphenation': [
        'error',
        'always',
        { ignore: ['blokkliData'] },
      ],
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      // Warning for now, to be ratcheted back to 'error' once the remaining
      // `any` usages are typed. Mirrors packages/nuxt-icms/eslint.config.mjs.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  })
