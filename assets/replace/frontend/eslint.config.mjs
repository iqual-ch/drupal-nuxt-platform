// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt().override('nuxt/vue/rules', {
  rules: {
    // Kebab-case in templates is the Vue style guide's recommendation and the
    // preset default, but the preset only warns — and the lint job does not
    // block on warnings, so nothing would stop the convention from drifting.
    //
    // `blokkliData` is exempt: it is not a declared prop on the presentational
    // components, it is a fallthrough attribute they read back by name through
    // `useAttrs()`, whose keys keep the casing written in the template.
    // Hyphenating it makes the lookup return undefined at runtime.
    'vue/attribute-hyphenation': [
      'error',
      'always',
      { ignore: ['blokkliData'] },
    ],
  },
})
