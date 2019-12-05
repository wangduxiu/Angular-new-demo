const fs = require('fs');

const packageJson = require('../package.json');
const environmentName = process.argv[2];
const buildDate = new Date().toLocaleString();
const environmentTemplate = JSON.parse(fs.readFileSync('./src/environments/environment.template.json'));

const environment = {
  ...environmentTemplate,
  version: packageJson.version,
  buildDate: buildDate,
  production: environmentName === 'prod',
  environmentName: environmentName, // 'dev' | 'qas' | 'prod'
};

fs.writeFileSync('./src/environments/environment.ts', 'export const environment = ' + JSON.stringify(environment) + ';');
