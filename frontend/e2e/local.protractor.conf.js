const config = require('./protractor.conf').config;

config.directConnect = true;
config.capabilities.chromeOptions.args.push('--start-maximized');

exports.config = config;
