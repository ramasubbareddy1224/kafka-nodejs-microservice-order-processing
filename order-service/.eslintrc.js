module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jest'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended'],
    rules: {
        quotes: ['error', 'single'],
        indent: ['warn', 4],
        '@typescript-eslint/explicit-function-return-type': 1,
        '@typescript-eslint/no-use-before-define': 1,
        '@typescript-eslint/no-var-requires': 1,
        '@typescript-eslint/no-explicit-any': 1
    },

    globals: {
        module: 'writable'
    }
};
