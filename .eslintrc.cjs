/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      files: ['src/game/*/*.ts'],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": "error",
      }
    }
  ]
};
