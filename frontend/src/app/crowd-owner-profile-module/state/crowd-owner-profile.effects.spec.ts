import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { CrowdOwnerProfileEffects } from './crowd-owner-profile.effects';
import { CrowdOwnerProfileService } from '../services/crowd-owner-profile.service';
import { exampleContactDetails } from '../model/contact-details';
import * as actions from './crowd-owner-profile.actions';
import { toArray } from 'rxjs/operators';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { dummyBase64Image } from '../../utils/base64-image';

describe('CompanyProfileEffects', () => {
  let actions$: Observable<any>;
  let effects: CrowdOwnerProfileEffects;
  let profileService: jasmine.SpyObj<CrowdOwnerProfileService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrowdOwnerProfileEffects,
        provideMockActions(() => actions$),
        {
          provide: CrowdOwnerProfileService,
          useValue:  jasmine.createSpyObj(CrowdOwnerProfileService, ['getContactInfo', 'getCompanyLogo']),
        },
      ],
    });

    effects = TestBed.get<CrowdOwnerProfileEffects>(CrowdOwnerProfileEffects);
    profileService = TestBed.get(CrowdOwnerProfileService);
  });

  describe('loadContactDetails', () => {
    beforeEach(() => {
      actions$ = of(actions.loadCompanyContact());
    });

    it('calls CrowdOwnerProfileService to get contact data', done => {
      profileService.getContactInfo.and.returnValue(of(exampleContactDetails()));
      effects.loadContactDetails.subscribe(() => {
        expect(profileService.getContactInfo).toHaveBeenCalled();
        done();
      });
    });

    it('dispatches succss action when done', done => {
      profileService.getContactInfo.and.returnValue(of(exampleContactDetails()));
      effects.loadContactDetails.subscribe(result => {
        expect(result).toEqual(actions.loadCompanyContactSuccess({contactDetails: exampleContactDetails()}));
        done();
      });
    });

    it('dispatches error on failure', done => {
      profileService.getContactInfo.and.returnValue(throwError('Error'));
      effects.loadContactDetails.pipe(toArray()).subscribe(result => {
        expect(result).toEqual([
          actions.loadCompanyContactFailure(),
          ReportingActions.reportError({}),
        ]);
        done();
      });
    });
  });

  describe('loadCompanyLogo', () => {
    beforeEach(() => {
      actions$ = of(actions.loadCompanyLogo());
    });

    it('calls CrowdOwnerProfileService', done => {
      profileService.getCompanyLogo.and.returnValue(of(dummyBase64Image));
      effects.loadCompanyLogo.subscribe(() => {
        expect(profileService.getCompanyLogo).toHaveBeenCalled();
        done();
      });
    });

    it('dispatches succss action when done', done => {
      profileService.getCompanyLogo.and.returnValue(of(dummyBase64Image));
      effects.loadCompanyLogo.subscribe(result => {
        expect(result).toEqual(actions.loadCompanyLogoSuccess({companyLogo: dummyBase64Image}));
        done();
      });
    });

    it('dispatches error on failure', done => {
      profileService.getCompanyLogo.and.returnValue(throwError('Error'));
      effects.loadCompanyLogo.subscribe(action => {
        expect(action).toEqual(actions.loadCompanyLogoFailure());
        done();
      });
    });
  });
});
