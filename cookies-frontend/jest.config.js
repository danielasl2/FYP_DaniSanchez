module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.js$': 'babel-jest',
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    testMatch: ['**/test/**/*.spec.js'],
    setupFilesAfterEnv: ['./test/jest.setup.js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!axios)'],
};