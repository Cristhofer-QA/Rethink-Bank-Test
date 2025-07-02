module.exports = {
  testMatch: ["**/tests/steps/**/*login.steps.js"],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Relatório de Testes",
      "outputPath": "./reports/test-report.html",
      "includeFailureMsg": true,
      "includeConsoleLog": true
    }]
  ]
};
