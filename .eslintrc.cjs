/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      parserOptions: {
        project: './tsconfig.json',
      },
      files: ['src/game/*/*.ts'],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/class-literal-property-style": "error",
        "class-methods-use-this": "off",
        "@typescript-eslint/class-methods-use-this": "error",
        "@typescript-eslint/consistent-generic-constructors": "error",
        "@typescript-eslint/consistent-indexed-object-style": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error"
      }
    }
  ]
};
