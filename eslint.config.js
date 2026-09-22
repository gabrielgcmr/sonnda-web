// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/app/**', '**/pages/**', '**/components/common/**'],
          message: 'Features must not depend on app composition, pages or common application components.',
        }],
      }],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}', 'src/utils/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/app/**', '**/pages/**', '**/features/**', '**/services/**', '**/lib/**', '**/common/**'],
          message: 'Generic UI and utilities must not depend on business features or application infrastructure.',
        }],
      }],
    },
  },
  {
    files: ['src/services/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/app/**', '**/pages/**', '**/features/**', '**/components/**'],
          message: 'Infrastructure must not depend on features or presentation.',
        }],
      }],
    },
  },
])
