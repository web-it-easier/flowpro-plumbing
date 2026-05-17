// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Catch unused variables and functions
      'no-unused-vars': 'error',
      // Catch unused private class members
      'no-unused-private-class-members': 'error'
    }
  }
)
