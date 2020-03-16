const config = require('./protractor.conf').config;

config.seleniumAddress = 'http://selenium.et-1.coreinfra.io:4444/wd/hub';
config.seleniumServerStartTimeout = 600000;
config.directConnect = false;
config.capabilities.chromeOptions.args.push('--window-size=1440,900');
config.capabilities.chromeOptions.args.push('--disable-gpu');
config.capabilities.chromeOptions.args.push('--headless');
config.capabilities.build = "PartnerPortal";
console.log('CONFIG')
console.log(config)
console.log('')
console.log('CAPABILITIES')
console.log(config.capabilities)

console.log('CHROME OPTIONS')

config.capabilities.chromeOptions.args.forEach(
  element => console.log(element));

exports.config = config;
