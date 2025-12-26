import js from '@eslint/js'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
        console: 'readonly'
      },
      ecmaVersion: 'latest'
    },
    rules: {
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'arrow-spacing': [
        'error',
        { 'before': true, 'after': true }
      ],
      'no-console': 0,
      'no-unused-vars': [
        'error',
        { 'argsIgnorePattern': '^_' }
      ]
    }
  }
]