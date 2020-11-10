import { CompanyProfileService } from './company-profile.service';
import { HttpResponse } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { exampleCompanyProfile } from '../model/company.profile';
import { exampleSaveCompanyProfileData } from '../model/save-company-profile-data';

describe('CompanyProfileService', () => {
  describe('navigateToEditor()', () => {
    it('should navigate to editor route', () => {
      const router = jasmine.createSpyObj(['navigateByUrl']);
      const service = new CompanyProfileService(router, null);

      service.navigateToEditor();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/company-profile-editor');
    });
  });

  describe('loadProfile()', () => {
    it('should ', () => {
      const appBackend = jasmine.createSpyObj(['get']);
      appBackend.get.withArgs('/companyProfile/read').and.returnValue(
        cold('a', {a: new HttpResponse({body: exampleCompanyProfile()})}),
      );
      const service = new CompanyProfileService(null, appBackend);

      expect(service.loadProfile()).toBeObservable(cold('a', {a: exampleCompanyProfile()}));
    });
  });

  describe('terminateRelationship()', () => {
    it('should terminate relationship', () => {
      const appBackend = jasmine.createSpyObj(['get']);
      const partnerId = '12345';
      appBackend.get.withArgs(`/partners/${partnerId}/action/terminate`).and.returnValue(
        cold('a', {a: new HttpResponse()}),
      );
      const service = new CompanyProfileService(null, appBackend);

      expect(service.terminateRelationship(partnerId)).toBeObservable(cold('a', {a:  new HttpResponse()}));
    });
  });

  describe('saveProfile()', () => {
    it('should save the profile', () => {
      const appBackend = jasmine.createSpyObj(['put']);
      appBackend.put.withArgs('/companyProfile/save', exampleSaveCompanyProfileData()).and.returnValue(
        cold('a', {a: new HttpResponse({body: exampleSaveCompanyProfileData()})}),
      );
      const service = new CompanyProfileService(null, appBackend);

      expect(service.saveProfile(exampleSaveCompanyProfileData())).toBeObservable(cold('a', {a: exampleSaveCompanyProfileData()}));
    });
  });

  describe('downloadDocument()', () => {
    it('should download the document as blob', () => {
      const documentId = '1';
      const appBackend = jasmine.createSpyObj(['getBlob']);
      appBackend.getBlob.withArgs(`/documents/${documentId}/download`).and.returnValue(
        cold('a', {a: new HttpResponse({body: new Blob()})}),
      );
      const service = new CompanyProfileService(null, appBackend);

      expect(service.downloadDocument(documentId)).toBeObservable(cold('a', {a: new Blob()}));
    });
  });
});
