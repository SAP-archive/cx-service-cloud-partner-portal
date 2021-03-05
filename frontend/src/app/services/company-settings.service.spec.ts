import { CompanySettingsService } from './company-settings.service';
import { AppBackendService } from './app-backend.service';
import { exampleCompanySettings } from '../model/company-settings';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import createSpyObj = jasmine.createSpyObj;

describe('CompanySettingsService', () => {
  let appBackendService: jasmine.SpyObj<AppBackendService>;
  let companySettingsService: CompanySettingsService;

  beforeEach(() => {
    appBackendService = createSpyObj(['get']);
    companySettingsService = new CompanySettingsService(appBackendService);
  });

  describe('fetch()', () => {
    it('should fetch company settings', done => {
      appBackendService.get.withArgs(`/company-settings`)
        .and.returnValue(of(new HttpResponse({body: exampleCompanySettings()})));

      companySettingsService.fetch().pipe(take(1)).subscribe(result => {
        expect(result).toEqual(exampleCompanySettings());
        done();
      });
    });
  });
});
