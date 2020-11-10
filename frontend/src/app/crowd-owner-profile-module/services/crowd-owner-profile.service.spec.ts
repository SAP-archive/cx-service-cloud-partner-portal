import { TestBed } from '@angular/core/testing';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { CrowdOwnerProfileService } from './crowd-owner-profile.service';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('CrowdOwnerProfileService', () => {
  let appBackend: jasmine.SpyObj<AppBackendService>;
  let profileService: jasmine.SpyObj<CrowdOwnerProfileService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppBackendService,
          useValue:  jasmine.createSpyObj(AppBackendService, ['get']),
        },
        CrowdOwnerProfileService,
      ],
    });

    appBackend = TestBed.inject(AppBackendService) as SpyObj<AppBackendService>;
    profileService = TestBed.inject(CrowdOwnerProfileService) as SpyObj<CrowdOwnerProfileService>;
  });

  describe('getContactInfo()', () => {
    it('uses AppBackendService to fetch contact info', done => {
      const expectedResponseBody = 'Test';
      appBackend.get
        .withArgs('/crowdOwnerContact')
        .and.returnValue(of({body: expectedResponseBody} as any));
      profileService.getContactInfo().subscribe(result => {
          expect(result).toEqual(expectedResponseBody as any);
          done();
        });
    });
  });
});
