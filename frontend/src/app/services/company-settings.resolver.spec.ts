import { CompanySettingsResolver } from './company-settings.resolver';
import { ConfigFacadeMockBuilder } from '../state/config/config.facade.mock.spec';
import { of } from 'rxjs';

describe('CompanySettingsResolver', () => {
  describe('resolve()', () => {
    it('should fetch company settings', () => {
      const settingsFacade = new ConfigFacadeMockBuilder()
        .setSelectAreCompanySettingsLoaded(of(false))
        .build();
      const resolver = new CompanySettingsResolver(settingsFacade);

      resolver.resolve(null, null);

      expect(settingsFacade.fetchCompanySettingsIfNotLoadedYet).toHaveBeenCalled();
    });
  });
});
