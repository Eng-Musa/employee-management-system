// This file configures Jest, a testing framework, for an Angular project.
// It tells Jest how to handle TypeScript files, where to find test files, and other settings to make testing work smoothly with Angular.
// Note: '<rootDir>' is a Jest variable that refers to the root directory of your project.

module.exports = {
    // Use a pre-set configuration for Angular projects to make testing easier.
    // This uses a pre-configured setup for Angular projects, provided by the jest-preset-angular package
    preset: 'jest-preset-angular',
    
    // Run this file after setting up the test environment to prepare for tests.
    //This runs a file (setup-jest.js) after the test environment is set up, 
    // which might contain custom code for mocking modules or setting global variables
    setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
    
    // Define how to transform .ts and .mjs files for testing.
    //defines how Jest transforms files, specifically .ts and .mjs files, using jest-preset-angular
    transform: {
        '^.+\\.(ts|mjs)$': ['jest-preset-angular', {
            // Use this TypeScript config file for tests, located in the project root.
            tsconfig: '<rootDir>/tsconfig.spec.json',
            // Treat .html and .svg files as strings during transformation, useful for Angular templates and assets.
            stringifyContentPathRegex: '\\.(html|svg)$',
        }]
    },
    
    // List of file extensions that Jest can import or work with, like .ts, .js, .json, .node.
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    
    // Skip transforming files in node_modules, except for .mjs files, to save time.
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    
    // Use a simulated DOM environment for running tests, needed for Angular components.
    //Sets up a fake browser environment for tests, needed for Angular components.
    testEnvironment: 'jest-environment-jsdom',
};