module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/unit/setup.ts'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^helpers$': '<rootDir>/tests/unit/helpers.ts',
  },
}
