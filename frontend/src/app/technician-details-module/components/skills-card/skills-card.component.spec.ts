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

describe('SkillsCardComponent', () => {
  type MockedState = RecursivePartial<{ [fromTechnicianProfile.technicianProfileFeatureKey]: fromTechnicianProfile.State }>;
  let store: MockStore<MockedState>;
  let component: SkillsCardComponent;
  let fixture: ComponentFixture<SkillsCardComponent>;
  let profileFacade: jasmine.SpyObj<TechnicianProfileFacade>;
  let reportingFacade: jasmine.SpyObj<ReportingFacade>;
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
                'toggleSkillDetailsView'],
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
      ],
    })
      .compileComponents();

    store = TestBed.get(Store);
    profileFacade = TestBed.get(TechnicianProfileFacade);
    reportingFacade = TestBed.get(ReportingFacade);
    fileReaderService = TestBed.get(FileReaderService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      const skill = exampleSkill();
      component.deleteCertificate(exampleSkillViewModel());
      expect(profileFacade.deleteCertificate).toHaveBeenCalledWith(exampleSkillViewModel().id);
    });
  });

  describe('undoCertificateDeletion()', () => {
    it('calls facade service', () => {
      const skill = exampleSkill();
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
