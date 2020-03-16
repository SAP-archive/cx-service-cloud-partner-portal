import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { CompanyProfileEffects } from './company-profile.effects';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { CompanyProfileService } from '../services/company-profile.service';
import * as CompanyProfileActions from './company-profile.actions';
import { exampleCompanyProfile } from '../model/company.profile';
import { saveAsInjectionToken } from '../injection-tokens';
import { exampleDocument } from '../model/document.model';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { exampleSaveCompanyProfileData } from '../model/save-company-profile-data';

describe('CompanyProfileEffects', () => {
  let actions$: Observable<any>;
  let effects: CompanyProfileEffects;
  let companyProfileServiceMock: jasmine.SpyObj<CompanyProfileService>;
  let metadata: EffectsMetadata<CompanyProfileEffects>;

  beforeEach(() => {
    companyProfileServiceMock = jasmine.createSpyObj(['loadProfile', 'saveProfile', 'downloadDocument']);

    TestBed.configureTestingModule({
      providers: [
        CompanyProfileEffects,
        {provide: CompanyProfileService, useValue: companyProfileServiceMock},
        {provide: saveAsInjectionToken, useValue: jasmine.createSpy()},
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get<CompanyProfileEffects>(CompanyProfileEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('loadCompanyProfile', () => {
    it('dispatch loadCompanyProfileSuccess', () => {
      companyProfileServiceMock.loadProfile.and.returnValue(of(exampleCompanyProfile()));
      actions$ = hot('--a-', {a: CompanyProfileActions.loadCompanyProfile()});

      const expected = cold(
        '--a',
        {a: CompanyProfileActions.loadCompanyProfileSuccess(exampleCompanyProfile())},
      );

      expect(effects.loadCompanyProfile).toBeObservable(expected);
    });

    it('should report error', () => {
      companyProfileServiceMock.loadProfile.and.returnValue(throwError(new HttpErrorResponse({error: {error: 'message'}})));
      actions$ = hot('--a-', {a: CompanyProfileActions.loadCompanyProfile()});

      const expected = cold('--(bc)', {
        b: CompanyProfileActions.loadCompanyProfileFailure(),
        c: ReportingActions.reportError({ message: 'COMPANY_PROFILE_EDITOR_LOAD_FAILED'}),
      });

      expect(effects.loadCompanyProfile).toBeObservable(expected);
    });
  });

  describe('saveCompanyProfile', () => {
    it('dispatch saveCompanyProfileSuccess', () => {
      companyProfileServiceMock.saveProfile.and.returnValue(of(exampleCompanyProfile()));
      actions$ = hot(
        '--a-',
        {a: CompanyProfileActions.saveCompanyProfile({saveData: exampleSaveCompanyProfileData()})},
      );

      const expected = cold(
        '--(ab)',
        {
          a: CompanyProfileActions.saveCompanyProfileSuccess(exampleCompanyProfile()),
          b: ReportingActions.reportSuccess({ message: 'COMPANY_PROFILE_EDITOR_UPDATED_SUCCEED' }),
        },
      );

      expect(effects.saveCompanyProfile).toBeObservable(expected);
    });

    it('should report error', () => {
      companyProfileServiceMock.saveProfile.and.returnValue(throwError(new HttpErrorResponse({error: {error: 'message'}})));
      actions$ = hot(
        '--a-',
        {a: CompanyProfileActions.saveCompanyProfile({saveData: exampleSaveCompanyProfileData()})},
      );

      const expected = cold('--(ab)', {
        a: CompanyProfileActions.saveCompanyProfileFailure(),
        b: ReportingActions.reportError({ message: 'COMPANY_PROFILE_EDITOR_UPDATED_FAILED' }),
      });

      expect(effects.saveCompanyProfile).toBeObservable(expected);
    });
  });


  describe('downloadDocument', () => {
    it('save the downloaded file', () => {
      const documentId = '1';
      const action = () => CompanyProfileActions.downloadDocument({document: exampleDocument(documentId)});
      companyProfileServiceMock.downloadDocument.withArgs(documentId).and.returnValue(of(new Blob()));
      actions$ = hot('--a-', {a: action()});

      const expected = cold(
        '--a',
        {a: new Blob()},
      );

      expect(effects.downloadDocument).toBeObservable(expected);
      expect(metadata.downloadDocument.dispatch).toBe(false);
      expect(TestBed.get(saveAsInjectionToken)).toHaveBeenCalledWith(new Blob(), exampleDocument(documentId).name);
    });
  });
});
