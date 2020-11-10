import { async, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import * as fromTechnicianProfile from 'src/app/technician-details-module/state/technician-profile.reducer';
import { skillViewModelsAdapter } from 'src/app/technician-details-module/state/technician-profile.reducer';
import { TechnicianProfileFacade } from './technician-profile.facade';
import { exampleSkill } from '../models/skill.model';
import { exampleTechnicianProfile } from '../models/technician-profile.model';
import {
  addCertificateUpload,
  collapseTagDetailsView,
  createTechnicianProfile,
  deleteCertificate,
  downloadCertificate,
  expandTagDetailsView,
  removeCertificateUpload,
  resetTechProfileData,
  saveTechnicianProfile,
  undoDeleteCertificate,
} from './technician-profile.actions';
import { exampleNewSkillCertificate } from '../models/skill-certificate.model';
import { exampleSkillViewModel } from '../models/skill-view.model';

describe('TechnicianProfileFacade', () => {
  type MockedState = RecursivePartial<{ [fromTechnicianProfile.technicianProfileFeatureKey]: fromTechnicianProfile.State }>;
  let store: MockStore<MockedState>;
  let facade: TechnicianProfileFacade;

  const getState = (profileState: RecursivePartial<fromTechnicianProfile.State>): RecursivePartial<MockedState> => ({
    [fromTechnicianProfile.technicianProfileFeatureKey]: {
      ...fromTechnicianProfile.initialState,
      ...profileState,
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: getState(fromTechnicianProfile.initialState),
        }),
        TechnicianProfileFacade,
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(TechnicianProfileFacade);
  }));

  describe('saveProfile()', () => {
    it('should trigger an update call', () => {
      const selectedNewSkillViewModel = {
        ...exampleSkillViewModel('1'),
        skill: null,
        selected: true,
        newCertificate: exampleNewSkillCertificate(),
      };

      const unselectedOldSkillViewModel = {
        ...exampleSkillViewModel('2'),
        selected: false,
      };

      const oldSkillViewModelWithCertificateToBeRemoved = {
        ...exampleSkillViewModel('3'),
        selected: true,
        certificateToBeDeleted: true,
      };

      store.setState(getState({
        skillViewModels: skillViewModelsAdapter.addAll(
          [
            selectedNewSkillViewModel,
            unselectedOldSkillViewModel,
            oldSkillViewModelWithCertificateToBeRemoved
          ],
          skillViewModelsAdapter.getInitialState()),
      }));

      const exampleProfile = exampleTechnicianProfile();
      const spy = spyOn(store, 'dispatch');
      facade.saveProfile(exampleProfile);
      expect(spy).toHaveBeenCalledWith(saveTechnicianProfile({
        profile: exampleProfile,
        skills: {
          add: [{
            tagExternalId: selectedNewSkillViewModel.tag.externalId,
            technicianExternalId: exampleTechnicianProfile().externalId,
            viewModelId: selectedNewSkillViewModel.id,
          }],
          remove: [unselectedOldSkillViewModel.skill],
        },
        certificates: {
          add: [{
            ...selectedNewSkillViewModel.newCertificate,
            viewModelId: selectedNewSkillViewModel.id,
          }],
          remove: [oldSkillViewModelWithCertificateToBeRemoved.skill],
        },
      }));
    });
  });

  describe('createProfile()', () => {
    it('should trigger a create call', () => {
      const selectedSkillViewModel = {
        ...exampleSkillViewModel('1'),
        skill: null,
        selected: true,
        newCertificate: exampleNewSkillCertificate(),
      };
      store.setState(getState({
        skillViewModels: skillViewModelsAdapter.addAll(
          [
            selectedSkillViewModel,
            {
              ...exampleSkillViewModel('2'),
              selected: false,
            },
          ],
          skillViewModelsAdapter.getInitialState()),
      }));

      const spy = spyOn(store, 'dispatch');
      facade.createProfile(exampleTechnicianProfile());
      expect(spy).toHaveBeenCalledWith(createTechnicianProfile({
        profile: exampleTechnicianProfile(),
        skills: [{
          tagExternalId: selectedSkillViewModel.tag.externalId,
          technicianExternalId: exampleTechnicianProfile().externalId,
          viewModelId: selectedSkillViewModel.id,
        }],
        certificates: [{
          ...selectedSkillViewModel.newCertificate,
          viewModelId: selectedSkillViewModel.id,
        }],
      }));
    });
  });

  describe('skillsEdited', () => {
    let emitSpy: jasmine.Spy;
    const assertEmitCall = (doneCallback: Function) => {
      expect(emitSpy).toHaveBeenCalled();
      doneCallback();
    };

    beforeEach(() => {
      emitSpy = spyOn(facade.skillsEdited, 'next').and.callThrough();
    });

    it('emits when addSkill() was called', done => {
      facade.skillsEdited.subscribe(() => assertEmitCall(done));
      facade.addSkill(exampleSkillViewModel());
    });

    it('emits when removeSkill() was called', done => {
      facade.skillsEdited.subscribe(() => assertEmitCall(done));
      facade.removeSkill(exampleSkillViewModel());
    });

    it('emits when deleteCertificate() was called', done => {
      facade.skillsEdited.subscribe(() => assertEmitCall(done));
      facade.deleteCertificate('TAGID');
    });
  });

  describe('downloadCertificate()', () => {
    it('dispatches a download action', () => {
      const profileData = exampleTechnicianProfile();
      const skill = exampleSkill();
      const spy = spyOn(store, 'dispatch');

      store.setState(getState({
        ...fromTechnicianProfile.initialState,
        profileData,
      }));

      facade.downloadCertificate(skill);
      expect(spy).toHaveBeenCalledWith(downloadCertificate({
        technicianId: profileData.externalId,
        skill,
      }));
    });
  });

  describe('addCertificate()', () => {
    it('dispatches addCertificateUpload action', () => {
      const spy = spyOn(store, 'dispatch');
      const certificate = exampleNewSkillCertificate();
      facade.addCertificateUpload(exampleSkillViewModel().id, certificate);
      expect(spy).toHaveBeenCalledWith(addCertificateUpload({skillViewModelId: exampleSkillViewModel().id, certificate}));
    });

    it('triggers skillsEdited', () => {
      const spy = spyOn(facade.skillsEdited, 'next');
      const certificate = exampleNewSkillCertificate();
      facade.addCertificateUpload(exampleSkillViewModel().id, certificate);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('removeCertificateUpload()', () => {
    it('dispatches removeCertificateUpload action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.removeCertificateUpload(exampleSkillViewModel().id);
      expect(spy).toHaveBeenCalledWith(removeCertificateUpload({skillViewModelId: exampleSkillViewModel().id}));
    });
  });

  describe('deleteCertificate()', () => {
    it('dispatches deleteCertificate action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.deleteCertificate(exampleSkillViewModel().id);
      expect(spy).toHaveBeenCalledWith(deleteCertificate({skillViewModelId: exampleSkillViewModel().id}));
    });
  });

  describe('undoCertificateDeletion()', () => {
    it('dispatches undoDeleteCertificate action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.undoCertificateDeletion(exampleSkillViewModel().id);
      expect(spy).toHaveBeenCalledWith(undoDeleteCertificate({skillViewModelId: exampleSkillViewModel().id}));
    });
  });

  describe('clearProfileData()', () => {
    it('dispatches resetTechProfileData action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.clearProfileData();
      expect(spy).toHaveBeenCalledWith(resetTechProfileData());
    });
  });

  describe('toggleSkillDetailsView()', () => {
    it('dispatches collapse action if details have been expanded', () => {
      const spy = spyOn(store, 'dispatch');
      const skillViewModel = {...exampleSkillViewModel(), expanded: true};
      facade.toggleSkillDetailsView(skillViewModel);
      expect(spy).toHaveBeenCalledWith(collapseTagDetailsView({
        skillViewModelId: exampleSkillViewModel().id,
      }));
    });

    it('dispatches expand action if details have been hidden', () => {
      const spy = spyOn(store, 'dispatch');
      const skillViewModel = {...exampleSkillViewModel(), expanded: false};
      facade.toggleSkillDetailsView(skillViewModel);
      expect(spy).toHaveBeenCalledWith(expandTagDetailsView({
        skillViewModelId: exampleSkillViewModel().id,
      }));
    });
  });
});
