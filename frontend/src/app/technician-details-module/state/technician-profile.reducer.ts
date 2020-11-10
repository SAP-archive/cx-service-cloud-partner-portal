import { Action, createReducer, on } from '@ngrx/store';
import * as TechnicianProfileActions from './technician-profile.actions';
import { emptyTechnicianProfile, TechnicianProfile } from '../models/technician-profile.model';
import { Tag } from '../models/tag.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Skill } from '../models/skill.model';
import { NewSkillCertificate } from '../models/skill-certificate.model';
import { emptySkillViewModel, SkillViewModel } from '../models/skill-view.model';

export const technicianProfileFeatureKey = 'technicianProfile';

export const skillViewModelsAdapter = createEntityAdapter<SkillViewModel>();

export interface State {
  isLoadingProfile: boolean;
  isLoadingTags: boolean;
  isLoadingSkills: boolean;
  isWaitingNavigate: boolean;
  profileData: TechnicianProfile | null;
  tags: Tag[] | null;
  skillViewModels: EntityState<SkillViewModel>;
}

export const initialState: State = {
  isLoadingProfile: false,
  isLoadingTags: false,
  isLoadingSkills: false,
  isWaitingNavigate: false,
  profileData: emptyTechnicianProfile(),
  tags: null,
  skillViewModels: skillViewModelsAdapter.getInitialState(),
};


const updateOrCreateSkillViewModelsWithSkill = ({skillViewModels, tags}: State, skills: Skill[]): EntityState<SkillViewModel> => {
  skills.forEach(skill => {
    const existingSkillViewModel = skillViewModelsAdapter.getSelectors()
      .selectAll(skillViewModels)
      .find(skillViewModel => {
        return skillViewModel.tag && skillViewModel.tag.externalId === skill.tagExternalId && !skillViewModel.skill;
      });

    if (existingSkillViewModel) {
      skillViewModels = skillViewModelsAdapter.updateOne(
        {
          id: existingSkillViewModel.id,
          changes: {skill, selected: true, expanded: null},
        },
        skillViewModels,
      );
    } else {
      skillViewModels = skillViewModelsAdapter.addOne(
        {
          ...emptySkillViewModel(skill, tags && tags.find(tag => tag.externalId === skill.tagExternalId)),
          selected: true,
          expanded: null,
        },
        skillViewModels,
      );
    }
  });

  return skillViewModels;
};

const updateOrCreateSkillViewModelsWithTags = (skillViewModels: EntityState<SkillViewModel>, tags: Tag[]): EntityState<SkillViewModel> => {
  tags.forEach(tag => {
    const existingSkillViewModels = skillViewModelsAdapter.getSelectors()
      .selectAll(skillViewModels)
      .filter(skillViewModel => {
        return skillViewModel.skill && skillViewModel.skill.tagExternalId === tag.externalId;
      });

    if (existingSkillViewModels.length > 0) {
      existingSkillViewModels.forEach(skillViewModel => {
        skillViewModels = skillViewModelsAdapter.updateOne(
          {
            id: skillViewModel.id,
            changes: {tag},
          },
          skillViewModels,
        );
      });
    } else {
      skillViewModels = skillViewModelsAdapter.addOne(emptySkillViewModel(null, tag), skillViewModels);
    }
  });

  return skillViewModels;
};

const expandSkillViewModels = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  const skillViewModel = skillViewModelsAdapter.getSelectors()
    .selectAll(skillViewModels)
    .find(viewModel => viewModel.id === skillViewModelId);

  if (skillViewModel) {
    skillViewModels = skillViewModelsAdapter.updateOne(
      {
        id: skillViewModel.id,
        changes: {expanded: true},
      },
      skillViewModels,
    );
  }

  return skillViewModels;
};

const collapseSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  const skillViewModel = skillViewModelsAdapter.getSelectors()
    .selectAll(skillViewModels)
    .find(viewModel => viewModel.id === skillViewModelId);

  if (skillViewModel) {
    skillViewModels = skillViewModelsAdapter.updateOne(
      {
        id: skillViewModel.id,
        changes: {expanded: false},
      },
      skillViewModels,
    );
  }

  return skillViewModels;
};

const selectSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {selected: true},
    },
    skillViewModels,
  );
};

const deselectSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {selected: false},
    },
    skillViewModels,
  );
};

const addCertificateToSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string, newCertificate: NewSkillCertificate): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {newCertificate},
    },
    skillViewModels,
  );
};

const removeCertificateUploadFromSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {newCertificate: null},
    },
    skillViewModels,
  );
};

const deleteCertificateFromSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {certificateToBeDeleted: true},
    },
    skillViewModels,
  );
};

const undoCertificateDeletionFromSkillViewModel = (skillViewModels: EntityState<SkillViewModel>, skillViewModelId: string): EntityState<SkillViewModel> => {
  return skillViewModelsAdapter.updateOne(
    {
      id: skillViewModelId,
      changes: {certificateToBeDeleted: false},
    },
    skillViewModels,
  );
};

const technicianProfileReducer = createReducer(
  initialState,

  on(TechnicianProfileActions.loadTechnicianProfile, state => ({
    ...state,
    isLoadingProfile: true,
  })),

  on(TechnicianProfileActions.loadTechnicianProfileSuccess, (state, action) => {
    return {
      ...state,
      profileData: action.data,
      isWaitingNavigate: false,
      isLoadingProfile: false,
    };
  }),

  on(TechnicianProfileActions.loadTechnicianProfileFailure, (state) => ({
    ...state,
    isLoadingProfile: false,
  })),

  on(TechnicianProfileActions.saveTechnicianProfile, state => ({
    ...state,
    isLoadingProfile: true,
  })),

  on(TechnicianProfileActions.saveTechnicianProfileSuccess, (state, {profile}) => ({
    ...state,
    isLoadingProfile: false,
    profileData: profile,
    skillViewModels: updateOrCreateSkillViewModelsWithTags(skillViewModelsAdapter.getInitialState(), state.tags),
  })),

  on(TechnicianProfileActions.saveTechnicianProfileFailure, state => {
    return {
      ...state,
      isLoadingProfile: false,
    };
  }),

  on(TechnicianProfileActions.createTechnicianProfile, state => ({
    ...state,
    isLoadingProfile: true,
  })),

  on(TechnicianProfileActions.createTechnicianProfileSuccess, state => ({
    ...state,
    isWaitingNavigate: true,
    isLoadingProfile: true,
  })),

  on(TechnicianProfileActions.createTechnicianProfileFailure, state => ({
    ...state,
    isWaitingNavigate: false,
    isLoadingProfile: false,
  })),

  on(TechnicianProfileActions.loadSkills, state => ({
    ...state,
    isLoadingSkills: true,
  })),

  on(TechnicianProfileActions.loadSkillsSuccess, (state, action) => ({
    ...state,
    isLoadingSkills: false,
    skillViewModels: updateOrCreateSkillViewModelsWithSkill(state, action.data),
  })),

  on(TechnicianProfileActions.loadSkillsFailure, state => ({
    ...state,
    isLoadingSkills: false,
  })),

  on(TechnicianProfileActions.loadTags, state => ({
    ...state,
    isLoadingTags: true,
  })),

  on(TechnicianProfileActions.loadTagsSuccess, (state, action) => ({
    ...state,
    tags: action.data,
    isLoadingTags: false,
    skillViewModels: updateOrCreateSkillViewModelsWithTags(state.skillViewModels, action.data),
  })),

  on(TechnicianProfileActions.loadTagsFailure, state => ({
    ...state,
    isLoadingTags: false,
  })),

  on(TechnicianProfileActions.removeSkillFromProfile, (state, {skillViewModelId}) => {
    return {
      ...state,
      skillViewModels: deselectSkillViewModel(state.skillViewModels, skillViewModelId),
    };
  }),

  on(TechnicianProfileActions.addSkillToProfile, (state, {skillViewModelId}) => {
    return {
      ...state,
      skillViewModels: selectSkillViewModel(state.skillViewModels, skillViewModelId),
    };
  }),

  on(TechnicianProfileActions.addCertificateUpload, (state, {skillViewModelId, certificate}) => ({
    ...state,
    skillViewModels: addCertificateToSkillViewModel(state.skillViewModels, skillViewModelId, certificate),
  })),

  on(TechnicianProfileActions.removeCertificateUpload, (state, {skillViewModelId}) => ({
    ...state,
    skillViewModels: removeCertificateUploadFromSkillViewModel(state.skillViewModels, skillViewModelId),
  })),

  on(TechnicianProfileActions.deleteCertificate, (state, {skillViewModelId}) => ({
    ...state,
    skillViewModels: deleteCertificateFromSkillViewModel(state.skillViewModels, skillViewModelId),
  })),

  on(TechnicianProfileActions.undoDeleteCertificate, (state, {skillViewModelId}) => ({
    ...state,
    skillViewModels: undoCertificateDeletionFromSkillViewModel(state.skillViewModels, skillViewModelId),
  })),

  on(TechnicianProfileActions.resetTechProfileData, (state) => ({
    ...state,
    profileData: emptyTechnicianProfile(),
    skillViewModels: skillViewModelsAdapter.getInitialState(),
  })),

  on(TechnicianProfileActions.expandTagDetailsView, (state, {skillViewModelId}) => ({
    ...state,
    skillViewModels: expandSkillViewModels(state.skillViewModels, skillViewModelId),
  })),

  on(TechnicianProfileActions.collapseTagDetailsView, (state, {skillViewModelId}) => ({
    ...state,
    skillViewModels: collapseSkillViewModel(state.skillViewModels, skillViewModelId),
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return technicianProfileReducer(state, action);
}
