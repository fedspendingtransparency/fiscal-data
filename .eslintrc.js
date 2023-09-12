module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    graphql: true,
  },
  extends: ['react-app', 'plugin:jsx-a11y/strict', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 7,
    parser: '@typescript-eslint/parser',
    babelOptions: {
      presets: [require.resolve(`babel-preset-gatsby`)],
    },
  },
  ignorePatterns: ['temp.js', 'node_modules/', '*.scss.d.ts'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/core-modules': ['gatsby'],
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/ban-types': [1],
        '@typescript-eslint/no-inferrable-types': [
          0,
          {
            ignoreParameters: true,
            ignoreProperties: true,
          },
        ],
      },
    },
  ],
  plugins: ['jsx-a11y'],
  rules: {
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
    'jsx-a11y/anchor-is-valid': [
      2,
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'linebreak-style': [1, 'unix'], // require *nix linebreaks
    'prefer-template': [0],
    'max-len': [1, 150], // max line length
    'comma-dangle': [0], // no trailing commas
    'semi-style': [2, 'last'], // require trailing semi-colons
    'func-style': [1, 'expression'], // arrow funcs
    'react/destructuring-assignment': [1, 'always'], // require objects to be destructured
    'react/jsx-pascal-case': [1],
    // require closing tag to be aligned with opening tag on its own line
    'react/jsx-closing-bracket-location': [1],
    'react/jsx-closing-tag-location': [1],
    'react/jsx-tag-spacing': [1],
    'react-hooks/rules-of-hooks': [2], // Checks rules of Hooks
    'react-hooks/exhaustive-deps': [0],
    // "jsx-quotes": [1, 'prefer-double'],
    'prefer-const': [1],
  },
};
