const fs = require('fs');

if (process.argv.length !== 3) {
  throw new Error('Usage: node update-app-config.js LAST_COMMIT_HASH');
}

const appConfigFileName = './appconfig.json';
const appConfig = JSON.parse(fs.readFileSync(appConfigFileName).toString());

appConfig.buildTimestamp = new Date().toUTCString();
appConfig.lastCommit = process.argv[2];

fs.writeFileSync(appConfigFileName, JSON.stringify(appConfig, null, 2));
