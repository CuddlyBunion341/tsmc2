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
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/class-literal-property-style": "error",
        "class-methods-use-this": "off",
        "@typescript-eslint/class-methods-use-this": "error",
      }
    }
  ]
};
