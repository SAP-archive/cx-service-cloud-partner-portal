import * as actions from './technician-profile.actions';
import { initialState, reducer, skillViewModelsAdapter, State } from './technician-profile.reducer';
import { exampleTechnicianProfile } from '../models/technician-profile.model';
import { emptyTag, exampleTag, Tag } from '../models/tag.model';
import { exampleSkill, Skill } from '../models/skill.model';
import { exampleSkillViewModel, SkillViewModel } from '../models/skill-view.model';
import { exampleNewSkillCertificate } from '../models/skill-certificate.model';

describe('technicianProfileReducer', () => {
  describe('loadTechnicianProfile', () => {
    it('sets isLoadingProfile to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: false,
      }, actions.loadTechnicianProfile);
      expect(result.isLoadingProfile).toBeTrue();
    });
  });

  describe('loadTechnicianProfileSuccess', () => {
    it('sets isLoadingProfile to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: true,
      }, actions.loadTechnicianProfileSuccess({data: undefined}));
      expect(result.isLoadingProfile).toBeFalse();
      expect(result.isWaitingNavigate).toBeFalse();
    });

    it('should set profile data', () => {
      const technician = exampleTechnicianProfile();
      const result = reducer({
        ...initialState,
        profileData: undefined,
      }, actions.loadTechnicianProfileSuccess({data: technician}));
      expect(result.profileData).toEqual(technician);
    });
  });

  describe('loadTechnicianProfileFailure', () => {
    it('sets isLoadingProfile to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: true,
      }, actions.loadTechnicianProfileFailure);
      expect(result.isLoadingProfile).toBeFalse();
    });
  });

  describe('saveTechnicianProfile', () => {
    it('sets isLoadingProfile to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: false,
      }, actions.saveTechnicianProfile);
      expect(result.isLoadingProfile).toBeTrue();
    });
  });

  describe('saveTechnicianProfileSuccess', () => {
    it('sets isLoadingProfile to false', () => {
      const result = reducer(
        {
          ...initialState,
          isLoadingProfile: true,
          tags: [],
        },
        actions.saveTechnicianProfileSuccess({profile: undefined}),
      );
      expect(result.isLoadingProfile).toBeFalse();
    });

    it('should set profile data', () => {
      const technician = exampleTechnicianProfile();
      const result = reducer({
        ...initialState,
        profileData: undefined,
        tags: [],
      }, actions.saveTechnicianProfileSuccess({profile: technician}));
      expect(result.profileData).toEqual(technician);
    });
  });

  describe('saveTechnicianProfileFailure', () => {
    it('sets isLoadingProfile to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: true,
      }, actions.saveTechnicianProfileFailure);
      expect(result.isLoadingProfile).toBeFalse();
    });
  });

  describe('createTechnicianProfile', () => {
    it('sets isLoadingProfile to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: false,
      }, actions.createTechnicianProfile);
      expect(result.isLoadingProfile).toBeTrue();
    });
  });
  describe('createTechnicianProfileSuccess', () => {
    it('sets isLoadingProfile to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: true,
      }, actions.createTechnicianProfileSuccess);
      expect(result.isLoadingProfile).toBeFalse();
      expect(result.isWaitingNavigate).toBeTrue();
    });
  });
  describe('createTechnicianProfileFailure', () => {
    it('sets isLoadingProfile to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingProfile: true,
      }, actions.createTechnicianProfileFailure);
      expect(result.isLoadingProfile).toBeFalse();
      expect(result.isWaitingNavigate).toBeFalse();
    });
  });


  describe('loadSkills', () => {
    it('sets isLoadingSkills to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingSkills: false,
      }, actions.loadSkills);
      expect(result.isLoadingSkills).toBeTrue();
    });
  });

  describe('loadSkillsSuccess', () => {
    it('sets isLoadingSkills to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingSkills: true,
      }, actions.loadSkillsSuccess({data: []}));
      expect(result.isLoadingSkills).toBeFalse();
    });

    describe('if no skill view models exist', () => {
      it('creates selected and expanded skill view models based on skills from action', () => {
        const result = reducer(
          {
            ...initialState,
            tags: [exampleTag('Tag1')],
          },
          actions.loadSkillsSuccess({
            data: [exampleSkill('Tag1'), exampleSkill('Tag2')],
          }),
        );

        const skillViewModels = skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels);

        const assertSkillViewModel = (skillViewModel: SkillViewModel, skill: Skill, tag: Tag) => {
          expect(skillViewModel.skill).toEqual(skill);
          expect(skillViewModel.tag).toEqual(tag);
          expect(skillViewModel.expanded).toBeTrue();
          expect(skillViewModel.selected).toBeTrue();
        };

        assertSkillViewModel(skillViewModels[0], exampleSkill('Tag1'), exampleTag('Tag1'));
        assertSkillViewModel(skillViewModels[1], exampleSkill('Tag2'), emptyTag());
      });
    });

    describe('if skill view model for a tag already exists', () => {
      it('updates the existing view models based on skills from action', () => {
        const skillViewModel1 = {...exampleSkillViewModel('SkillViewModel1'), skill: null, tag: exampleTag('Tag1')};
        const skillViewModel2 = {...exampleSkillViewModel('SkillViewModel2'), skill: null, tag: exampleTag('Tag2')};
        const result = reducer(
          {
            ...initialState,
            skillViewModels: skillViewModelsAdapter.addMany(
              [
                skillViewModel1,
                skillViewModel2,
              ],
              skillViewModelsAdapter.getInitialState(),
            ),
          },
          actions.loadSkillsSuccess({
            data: [exampleSkill('Tag1'), exampleSkill('Tag2')],
          }),
        );

        const skillViewModels = skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels);

        expect(skillViewModels[0]).toEqual({
          ...skillViewModel1,
          selected: true,
          expanded: true,
          skill: exampleSkill('Tag1'),
        });
        expect(skillViewModels[1]).toEqual({
          ...skillViewModel2,
          selected: true,
          expanded: true,
          skill: exampleSkill('Tag2'),
        });
      });
    });
  });

  describe('loadSkillsFailure', () => {
    it('sets isLoadingSkills to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingSkills: true,
      }, actions.loadSkillsFailure);
      expect(result.isLoadingSkills).toBeFalse();
    });
  });

  describe('loadTags', () => {
    it('sets isLoadingTags to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingTags: false,
      }, actions.loadTags);
      expect(result.isLoadingTags).toBeTrue();
    });
  });

  describe('loadTagsSuccess', () => {
    it('sets isLoadingSkills to false', () => {
      const result = reducer({
        ...initialState,
        isLoadingTags: true,
      }, actions.loadTagsSuccess({data: []}));
      expect(result.isLoadingTags).toBeFalse();
    });

    it('stores tag data', () => {
      const expectedValue = [exampleTag()];
      const result = reducer({
        ...initialState,
        tags: null,
      }, actions.loadTagsSuccess({data: expectedValue}));
      expect(result.tags).toEqual(expectedValue);
    });

    describe('if no skill view models exist', () => {
      it('creates skill view models with tags from action', () => {
        const result = reducer(
          {
            ...initialState,
            tags: [exampleTag('Tag1')],
          },
          actions.loadTagsSuccess({
            data: [exampleTag('Tag1'), exampleTag('Tag2')],
          }),
        );

        const skillViewModels = skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels);

        expect(skillViewModels[0].tag).toEqual(exampleTag('Tag1'));
        expect(skillViewModels[1].tag).toEqual(exampleTag('Tag2'));
      });
    });

    describe('if skill view model for a tag already exists', () => {
      it('updates the existing view models with tags from action', () => {
        const skillViewModel1 = {...exampleSkillViewModel('SkillViewModel1'), skill: exampleSkill('Tag1'), tag: null};
        const skillViewModel2 = {...exampleSkillViewModel('SkillViewModel2'), skill: exampleSkill('Tag2'), tag: null};
        const result = reducer(
          {
            ...initialState,
            skillViewModels: skillViewModelsAdapter.addMany(
              [
                skillViewModel1,
                skillViewModel2,
              ],
              skillViewModelsAdapter.getInitialState(),
            ),
          },
          actions.loadTagsSuccess({
            data: [exampleTag('Tag1'), exampleTag('Tag2')],
          }),
        );

        const skillViewModels = skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels);

        expect(skillViewModels[0]).toEqual({
          ...skillViewModel1,
          tag: exampleTag('Tag1'),
        });
        expect(skillViewModels[1]).toEqual({
          ...skillViewModel2,
          tag: exampleTag('Tag2'),
        });
      });
    });
  });

  describe('loadTagsFailure', () => {
    it('sets isLoadingTags to true', () => {
      const result = reducer({
        ...initialState,
        isLoadingTags: true,
      }, actions.loadTagsFailure);
      expect(result.isLoadingTags).toBeFalse();
    });
  });

  describe('addSkillToProfile', () => {
    it('sets selected flag to true on provided skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), selected: false},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.addSkillToProfile({skillViewModelId: exampleSkillViewModel().id}));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          selected: true,
        }]);
    });
  });


  describe('removeSkillFromProfile', () => {
    it('sets selected flag to false on provided skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), selected: true},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.removeSkillFromProfile({skillViewModelId: exampleSkillViewModel().id}));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          selected: false,
        }]);
    });
  });

  describe('addCertificateUpload', () => {
    it('sets newCertificate on skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), newCertificate: null},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.addCertificateUpload({
        skillViewModelId: exampleSkillViewModel().id,
        certificate: exampleNewSkillCertificate(),
      }));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          newCertificate: exampleNewSkillCertificate(),
        }]);
    });
  });

  describe('removeCertificateUpload', () => {
    it('removes newCertificate from skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), newCertificate: exampleNewSkillCertificate()},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.removeCertificateUpload({
        skillViewModelId: exampleSkillViewModel().id,
      }));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          newCertificate: null,
        }]);
    });
  });

  describe('deleteCertificate', () => {
    it('removes certificateToBeDeleted to true on skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), certificateToBeDeleted: false},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.deleteCertificate({
        skillViewModelId: exampleSkillViewModel().id,
      }));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          certificateToBeDeleted: true,
        }]);
    });
  });

  describe('undoDeleteCertificate', () => {
    it('removes certificateToBeDeleted to false on skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), certificateToBeDeleted: true},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.undoDeleteCertificate({
        skillViewModelId: exampleSkillViewModel().id,
      }));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          certificateToBeDeleted: false,
        }]);
    });
  });

  describe('expandTagDetailsView', () => {
    it('sets expanded flag to true on provided skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), expanded: false},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.expandTagDetailsView({skillViewModelId: exampleSkillViewModel().id}));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          expanded: true,
        }]);
    });
  });

  describe('collapseTagDetailsView', () => {
    it('sets expanded flag to false on provided skill view model', () => {
      const exampleState = {
        ...initialState,
        skillViewModels: skillViewModelsAdapter.addOne(
          {...exampleSkillViewModel(), expanded: true},
          skillViewModelsAdapter.getInitialState(),
        ),
      } as State;
      const result = reducer(exampleState, actions.collapseTagDetailsView({skillViewModelId: exampleSkillViewModel().id}));
      expect(skillViewModelsAdapter.getSelectors().selectAll(result.skillViewModels))
        .toEqual([{
          ...exampleSkillViewModel(),
          expanded: false,
        }]);
    });
  });

  describe('resetTechProfileData', () => {
    it('resets technician profile state', () => {
      const exampleState = {
        ...initialState,
        profileData: exampleTechnicianProfile(),
        skillViewModels: skillViewModelsAdapter.addOne(exampleSkillViewModel(), skillViewModelsAdapter.getInitialState()),
      } as State;
      const result = reducer(exampleState, actions.resetTechProfileData());
      expect(result).toEqual(initialState);
    });
  });
});
