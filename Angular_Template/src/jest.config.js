module.exports = {
  collectCoverageFrom: [
    "**/src/app/core/store/**/*.{ts}"
  ],
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "<rootDir>/src/jestSetup.ts",
  transform: {
    "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@ngrx|angularfire2))"
  ],
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/app/$1",
  },
};
