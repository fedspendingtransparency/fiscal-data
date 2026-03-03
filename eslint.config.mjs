import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
  // Global ignores (replaces ignorePatterns)
  {
    ignores: [
      'temp.js',
      'node_modules/',
      '**/*.scss.d.ts',
      '**/*.scss',
      '.cache/',
      'public/',
    ],
  },

  // Base config for all JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
        __PATH_PREFIX__: 'readonly',
        graphql: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/core-modules': ['gatsby'],
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Import rules
      'import/extensions': [
        2,
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-anonymous-default-export': [1],

      // Accessibility
      'jsx-a11y/anchor-is-valid': [
        2,
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],

      // Code style
      'linebreak-style': [1, 'unix'],
      'prefer-template': [0],
      'max-len': [1, 150],
      'comma-dangle': [0],
      'semi-style': [2, 'last'],
      'func-style': [1, 'expression'],
      'prefer-const': [1],

      // React
      'react/destructuring-assignment': [1, 'always'],
      'react/jsx-pascal-case': [1],
      'react/jsx-closing-bracket-location': [1],
      'react/jsx-closing-tag-location': [1],
      'react/jsx-tag-spacing': [1],
      'react/jsx-uses-react': [1],
      'react/jsx-uses-vars': [1],

      // React Hooks
      'react-hooks/rules-of-hooks': [2],
      'react-hooks/exhaustive-deps': [0],

      // Unused imports/vars
      'no-unused-vars': [0],
      'unused-imports/no-unused-imports': [1],
      'unused-imports/no-unused-vars': [
        1,
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // TypeScript-specific config (replaces overrides block)
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      '@typescript-eslint/no-inferrable-types': [0],
      '@typescript-eslint/no-unused-vars': [0],
      '@typescript-eslint/no-explicit-any': [1],
      '@typescript-eslint/no-empty-object-type': [1],
    },
  },

  // Jest test files
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Prettier must be last - disables conflicting rules
  prettierConfig,
];
