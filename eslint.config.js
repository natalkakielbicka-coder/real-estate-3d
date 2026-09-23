import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },

  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,vue}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  prettier,
]
