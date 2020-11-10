import { TestBed } from '@angular/core/testing';
import { CrowdOwnerProfileMaterialModule } from '../../crowd-owner-profile-material-module';
import { CommonModule } from '@angular/common';
import { CrowdOwnerProfileTileComponent } from './crowd-owner-profile-tile.component';
import { CrowdOwnerProfileFacade } from '../../state/crowd-owner-profile.facade';
import { FakeDataModule } from 'src/app/fake-data-module/fake-data.module';
import { AbbreviatePipeModule } from 'src/app/abbreviate-pipe-module/abbreviate-pipe.module';
import { AuthFacade } from 'src/app/auth-module/state/auth/auth.facade';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { dummyBase64Image } from '../../../utils/base64-image';
import SpyObj = jasmine.SpyObj;

describe('CrowdOwnerProfileTileComponent', () => {
  let profileFacade: jasmine.SpyObj<CrowdOwnerProfileFacade>;
  let component: CrowdOwnerProfileTileComponent;
  let domSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        CrowdOwnerProfileMaterialModule,
        FakeDataModule,
        AbbreviatePipeModule,
      ],
      declarations: [
        CrowdOwnerProfileTileComponent,
      ],
      providers: [
        {
          provide: CrowdOwnerProfileFacade,
          useValue: {
            ...jasmine.createSpyObj(CrowdOwnerProfileFacade, ['loadContactInfo', 'loadCompanyLogo', 'loadCrowdName']),
            companyLogo: of(dummyBase64Image),
          } as CrowdOwnerProfileFacade,
        },
        {
          provide: AuthFacade,
          useValue: jasmine.createSpyObj(AuthFacade, ['companyName']),
        },
        {
          provide: DomSanitizer,
          useValue: jasmine.createSpyObj(DomSanitizer, ['bypassSecurityTrustUrl']),
        },
      ],
    });

    profileFacade = TestBed.inject(CrowdOwnerProfileFacade) as SpyObj<CrowdOwnerProfileFacade>;
    domSanitizer = TestBed.inject(DomSanitizer) as SpyObj<DomSanitizer>;
    component = TestBed.createComponent(CrowdOwnerProfileTileComponent).componentInstance;
  });

  describe('ngOnInit()', () => {
    it('triggers loading of contact info', () => {
      component.ngOnInit();
      expect(profileFacade.loadContactInfo).toHaveBeenCalled();
    });
  });

  describe('logo', () => {
    it('uses DomSanitizer to prepare base64 image', done => {
      domSanitizer
        .bypassSecurityTrustUrl.withArgs(dummyBase64Image)
        .and.returnValue(`sanitized:${dummyBase64Image}`);
      component.logo.subscribe(result => {
        expect(domSanitizer.bypassSecurityTrustUrl).toHaveBeenCalled();
        expect(result).toEqual(`sanitized:${dummyBase64Image}`);
        done();
      });
    });
  });
});
