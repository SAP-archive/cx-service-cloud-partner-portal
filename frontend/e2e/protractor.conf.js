// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const environments = require('./env.js')
const SpecReporter = require('jasmine-spec-reporter').SpecReporter

exports.config = {
  params: {
    useEnv: 'localhost',
    envs: environments
  },
  directConnect: '',
  allScriptsTimeout: 60000,
  getPageTimeout: 60000,
  seleniumAddress: '',
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage']
    }
  },
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000, // 5 minutes, wait for the async method to finish
    print: function () {}
  },
  onPrepare () {
    browser.manage().window().maximize()
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    })

    jasmine.getEnv().addReporter(
      new SpecReporter({
        suite: {
          displayNumber: true,
        },
        spec: {
          displayStacktrace: true,
          displayFailed: true,
          displayErrorMessages: true
        },
        summary: {
          displayStacktrace: true,
          displayErrorMessages: true,
          displayDuration: true,
          displayFailed: true
        },
        stacktrace: {
          filter: stack => {
            return stack.split('\n').filter(item => {
              const regex = /.*\.js:\d*:\d*\)?/gm;
              return !regex.test(item)})
              .join('\n');
          }
        }
      })
    );
  }
}
