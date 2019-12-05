const fs = require('fs-extra');
var replace = require('replace-in-file');
var packagejson = require('./package.json');

const template = 'src/environments/environment.template.ts';
const target = 'src/environments/environment.ts';
function setValue(name, value) {
  const options = {
    files: target,
    from: name,
    to: value,
    allowEmptyPaths: false
  };

  try {
    var changedFiles = replace.sync(options);
    if (changedFiles.length)
      console.log('Changed: ' + value);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

var buildVersion = packagejson.version;
var isProduction = process.argv[2] && 'true' === process.argv[2].toLowerCase();
var environment = process.argv[3];
var buildDate = new Date().toLocaleString();

fs.copySync(template, target);

setValue(/version: (.*)/g, 'version: \'' + buildVersion + '\',');
setValue(/production: (.*)/g, 'production: ' + isProduction + ',');
setValue(/buildDate: (.*)/g, 'buildDate: \'' + buildDate + '\',');
setValue(/environment: (.*)/g, 'environment: \'' + environment + '\',');
