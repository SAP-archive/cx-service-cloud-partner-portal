import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsCardComponent } from './skills-card.component';
import { TechnicianDetailsMaterialModule } from '../../technician-details-material.module';
import { translateModule } from 'src/app/utils/translate.module';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import * as fromTechnicianProfile from 'src/app/technician-details-module/state/technician-profile.reducer';
import { HttpClientModule } from '@angular/common/http';
import { TechnicianProfileFacade } from '../../state/technician-profile.facade';
import { ApprovalDecisionStatusModule } from 'src/app/approval-decision-status-module/approval-decision-status.module';
import { of } from 'rxjs';
import { exampleSkill } from '../../models/skill.model';
import { FileUploaderModule } from 'src/app/file-uploader/file-uploader.module';
import { FileReaderService } from 'src/app/file-uploader/services/file-reader.service';
import { exampleSkillViewModel } from '../../models/skill-view.model';
import { ReportingFacade } from 'src/app/state/reporting/reporting.facade';
import { LocalisationService } from 'src/app/services/localisation.service';
import { ChangeDetectorRef } from '@angular/core';
import SpyObj = jasmine.SpyObj;

describe('SkillsCardComponent', () => {
  type MockedState = RecursivePartial<{ [fromTechnicianProfile.technicianProfileFeatureKey]: fromTechnicianProfile.State }>;
  let store: MockStore<MockedState>;
  let component: SkillsCardComponent;
  let fixture: ComponentFixture<SkillsCardComponent>;
  let profileFacade: jasmine.SpyObj<TechnicianProfileFacade>;
  let reportingFacade: jasmine.SpyObj<ReportingFacade>;
  let localisationService: jasmine.SpyObj<LocalisationService>;
  let cd: jasmine.SpyObj<ChangeDetectorRef>;
  let fileReaderService: jasmine.SpyObj<FileReaderService>;

  const getState = (profileState: RecursivePartial<fromTechnicianProfile.State> =
                      fromTechnicianProfile.initialState): RecursivePartial<MockedState> => ({
    [fromTechnicianProfile.technicianProfileFeatureKey]: profileState,
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TechnicianDetailsMaterialModule,
        translateModule,
        HttpClientModule,
        ApprovalDecisionStatusModule,
        FileUploaderModule,
      ],
      declarations: [SkillsCardComponent],
      providers: [
        provideMockStore({
          initialState: getState({
            ...fromTechnicianProfile.initialState,
            isLoadingProfile: true,
            profileData: null,
          }),
        }),
        {
          provide: TechnicianProfileFacade,
          useValue: {
            ...jasmine.createSpyObj(
              TechnicianProfileFacade,
              ['removeSkill', 'addSkill', 'downloadCertificate', 'addCertificateUpload',
                'removeCertificateUpload', 'deleteCertificate', 'undoCertificateDeletion',
                'toggleSkillDetailsView', 'collapseTagDetailsView'],
            ),
            skillViewModels: of(),
          },
        },
        {
          provide: ReportingFacade,
          useValue: jasmine.createSpyObj(ReportingFacade, ['reportError']),
        },
        {
          provide: FileReaderService,
          useValue: jasmine.createSpyObj(FileReaderService, ['readContents']),
        },
        {
          provide: LocalisationService,
          useValue: jasmine.createSpyObj(LocalisationService, ['getInitialLocalisation']),
        },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj(ChangeDetectorRef, ['detectChanges']),
        },
      ],
    })
      .compileComponents();

    store = TestBed.inject(Store) as MockStore<MockedState>;
    profileFacade = TestBed.inject(TechnicianProfileFacade) as SpyObj<TechnicianProfileFacade>;
    reportingFacade = TestBed.inject(ReportingFacade) as SpyObj<ReportingFacade>;
    fileReaderService = TestBed.inject(FileReaderService) as SpyObj<FileReaderService>;
    localisationService = TestBed.inject(LocalisationService) as SpyObj<LocalisationService>;
    cd = TestBed.inject(ChangeDetectorRef) as SpyObj<ChangeDetectorRef>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('isLinkVisible()', () => {
    it('should return false, expanded is null, remarks text is short, ' +
      'no need to show expand and collapse button', () => {
      const skillViewModel = {...exampleSkillViewModel(), expanded: null};

      const element = document.createElement('div');
      spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(20);
      window.getComputedStyle = jasmine.createSpy().and.returnValue({'lineHeight': '20px'});
      const result = component.isLinkVisible(skillViewModel, element);
      expect(result).toBe(false);
    });

    it('should return true, expanded is null, remarks text is long,' +
      'need to show expand button and collapse the text', () => {
      const skillViewModel = {...exampleSkillViewModel(), expanded: null};
      const element = document.createElement('div');
      spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(60);
      window.getComputedStyle = jasmine.createSpy().and.returnValue({'lineHeight': '20px'});
      const result = component.isLinkVisible(skillViewModel, element);

      expect(profileFacade.collapseTagDetailsView).toHaveBeenCalledWith(skillViewModel);
      expect(result).toBe(true);
    });

    it('should return true, expanded is not null, show expand button and collapse the text', () => {
      const skillViewModel = {...exampleSkillViewModel(), expanded: true};
      const element = document.createElement('div');
      const result = component.isLinkVisible(skillViewModel, element);
      expect(result).toBe(true);
    });

  });

  describe('formatDate()', () => {

    it('should return N/A', () => {
      localisationService.getInitialLocalisation = jasmine.createSpy().and.returnValue({code: 'en-gb'});
      expect(component.formatDate(null) === 'N/A').toBeTrue();
    });
    it('should return Invalid Date', () => {
      localisationService.getInitialLocalisation = jasmine.createSpy().and.returnValue({code: 'en-gb'});
      expect(component.formatDate('test date string') === 'Invalid Date').toBeTrue();
    });
    it('should return valid date string', () => {
      localisationService.getInitialLocalisation = jasmine.createSpy().and.returnValue({code: 'en-gb'});
      expect(component.formatDate('2020-12-01') === '01/12/2020').toBeTrue();
    });
  });

  describe('toggleTag()', () => {
    it('if skill was already selected, call "remove skill" method', () => {
      const skillViewModel = {...exampleSkillViewModel(), selected: true};
      component.toggleTag(skillViewModel);
      expect(profileFacade.removeSkill).toHaveBeenCalledWith(skillViewModel);
    });

    it('if skill was not, call "add skill" method', () => {
      const skillViewModel = {...exampleSkillViewModel(), selected: false};
      component.toggleTag(skillViewModel);
      expect(profileFacade.addSkill).toHaveBeenCalledWith(skillViewModel);
    });
  });

  describe('downloadCertificate()', () => {
    it('calls facade service', () => {
      const skill = exampleSkill();
      component.downloadCertificate(skill);
      expect(profileFacade.downloadCertificate).toHaveBeenCalledWith(skill);
    });
  });

  describe('addCertificateUpload()', () => {
    const exampleFile = ({name: 'file.pdf', type: 'application/pdf'} as Partial<File>) as any;
    const dummyContent = 'dummy-content';

    beforeEach(() => {
      fileReaderService.readContents.withArgs([exampleFile]).and.returnValue(of(dummyContent));
    });

    it('uses FileReaderService to read contents', () => {
      component.addCertificateUpload(exampleFile, exampleSkillViewModel());
      expect(fileReaderService.readContents).toHaveBeenCalled();
    });

    it('calls the facade service to add the certificate', () => {
      const skillViewModel = exampleSkillViewModel();
      component.addCertificateUpload(exampleFile, skillViewModel);
      expect(profileFacade.addCertificateUpload).toHaveBeenCalledWith(
        skillViewModel.id,
        {
          fileName: exampleFile.name,
          fileContents: dummyContent,
          contentType: exampleFile.type,
          skillId: skillViewModel.skill.uuid,
          viewModelId: skillViewModel.id,
        },
      );
    });
  });

  describe('onUploadError()', () => {
    it('should report error using facade', () => {
      const message = 'some error';
      component.onUploadError({error: message});
      expect(reportingFacade.reportError).toHaveBeenCalledWith(message);
    });
  });

  describe('removeCertificateUpload()', () => {
    it('calls facade service', () => {
      component.removeCertificateUpload(exampleSkillViewModel());
      expect(profileFacade.removeCertificateUpload).toHaveBeenCalledWith(exampleSkillViewModel().id);
    });
  });

  describe('deleteCertificate()', () => {
    it('calls facade service', () => {
      component.deleteCertificate(exampleSkillViewModel());
      expect(profileFacade.deleteCertificate).toHaveBeenCalledWith(exampleSkillViewModel().id);
    });
  });

  describe('undoCertificateDeletion()', () => {
    it('calls facade service', () => {
      component.undoCertificateDeletion(exampleSkillViewModel());
      expect(profileFacade.undoCertificateDeletion).toHaveBeenCalledWith(exampleSkillViewModel().id);
    });
  });

  describe('toggleTagDetails()', () => {
    it('calls facade service', () => {
      const skillViewModel = exampleSkillViewModel();
      component.toggleTagDetails(skillViewModel);
      expect(profileFacade.toggleSkillDetailsView).toHaveBeenCalledWith(skillViewModel);
    });
  });
});
