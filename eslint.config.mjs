import globals from 'globals'
import jsPlugin from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import playwrightPlugin from 'eslint-plugin-playwright'

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'prettier.config.js',
      'coverage',
      'eslint.config.mjs',
      'playwright.config.ts',
    ],
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      playwright: playwrightPlugin,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...prettier.rules,
      'import/newline-after-import': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error', 'assert', 'info'],
        },
      ],
      curly: 'error',
      'no-unsafe-optional-chaining': 'warn',
      'no-return-await': 'error',
      'prefer-rest-params': 'off',
    },
  },
  {
    files: ['*.js', '*.jsx', '*.mdx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['*.{stories,pw}.{spec,test}.ts'],
    extends: ['plugin:playwright/recommended'],
    rules: {
      'playwright/no-focused-tests': 'error', // Ensure no test.only or describe.only
    },
  },
]
