import { CompanyProfileResolver } from './company-profile.resolver';
import { cold } from 'jasmine-marbles';
import { exampleCompanyDetails } from '../model/company-profile.model';
import { CompanyProfileFacadeMockBuilder } from '../state/company-profile-facade.mock.spec';

describe('CompanyProfileResolver', () => {
  describe('resolve()', () => {
    it('should load company profile if not loaded already', () => {
      const profileFacade = new CompanyProfileFacadeMockBuilder().build();
      const resolver = new CompanyProfileResolver(profileFacade);

      resolver.resolve(null, null);

      expect(profileFacade.loadCompanyProfileIfNotLoadedAlready).toHaveBeenCalled();
    });

    it('should return an observable with company profile from the facade', () => {
      const profileObservable = () => cold('a-a', {a: exampleCompanyDetails()});
      const profileFacade = new CompanyProfileFacadeMockBuilder()
        .setCompanyDetails(profileObservable())
        .build();
      const resolver = new CompanyProfileResolver(profileFacade);

      expect(resolver.resolve(null, null)).toBeObservable(
        cold('(a|)', {a: exampleCompanyDetails()}),
      );
    });
  });
});
