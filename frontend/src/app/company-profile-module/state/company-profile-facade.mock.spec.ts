import { CompanyProfileFacade } from './company-profile.facade';
import { of } from 'rxjs';
import { exampleCompanyDetails } from '../model/company-profile.model';
import SpyObj = jasmine.SpyObj;

export class CompanyProfileFacadeMockBuilder {
  private mock = jasmine.createSpyObj<CompanyProfileFacade>([
    'loadCompanyProfileIfNotLoadedAlready',
    'loadCompanyProfile',
    'saveCompanyProfile',
  ]);

  constructor() {
    this.mock.name = of(undefined);
    this.mock.isSaving = of(false);
    this.mock.companyDetails = of(exampleCompanyDetails());
    this.mock.isProfileLoaded = of(false);
  }

  public build(): SpyObj<CompanyProfileFacade> {
    return this.mock;
  }

  public setName(name: any) {
    this.mock.name = name;
    return this;
  }

  public setIsSaving(isSaving: any) {
    this.mock.isSaving = isSaving;
    return this;
  }

  public setCompanyDetails(companyDetails: any) {
    this.mock.companyDetails = companyDetails;
    return this;
  }

  public setIsProfileLoaded(isProfileLoaded: any) {
    this.mock.isProfileLoaded = isProfileLoaded;
    return this;
  }
}
