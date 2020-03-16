import assert = require('assert');
import AppConfiguration = require('./AppConfiguration');
import TestConfigurationService = require('./test/TestConfigurationService');

let configuration: any = {};

describe('AppConfiguration', () => {
  let originalId;

  before(() => {
    originalId = AppConfiguration.portalClientId;
  });

  beforeEach(() => {
    configuration = {
        dataCloudHost: 'iet.dev.coresuite.com',
        dataCloudPort: 443,
        listenPort: 8000,
        mode: 'development',
        directoryService: 'https://iet.dev.coresuite.com',
        auth: {
          oauthUrl: 'https://iet.dev.coresuite.com/mc/api/oauth2/v1/',
          clientId: 'et-portal',
          clientSecret: 'aaaaabbbbbccccccdddddeeeeeffffff'
        }
      };
  });

  afterEach(() => {
    TestConfigurationService.configureAppForTesting();
    configuration.portalClientId = originalId;
  });

  it('should provide default value for portalClientId', () => {
    AppConfiguration.loadFromObject(configuration);
    assert.equal(AppConfiguration.portalClientId, 'PARTNER_PORTAL');
  });

  it('should provide configured value for portalClientId', () => {
    const oldId = AppConfiguration.portalClientId;
    const testPortalClientId = 'PARTNER_PORTAL';
    configuration.portalClientId = testPortalClientId;
    AppConfiguration.loadFromObject(configuration);
    assert.equal(AppConfiguration.portalClientId, testPortalClientId);

    AppConfiguration.loadFromObject(configuration);
  });

});
