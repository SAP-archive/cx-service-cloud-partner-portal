import { createAction, props } from '@ngrx/store';
import { TechnicianProfile } from '../models/technician-profile.model';
import { Skill, SkillWithViewModelId } from '../models/skill.model';
import { Tag } from '../models/tag.model';
import { NewCertificateWithViewModelId, NewSkillCertificate } from '../models/skill-certificate.model';

export const loadTechnicianProfile = createAction(
  '[TechnicianProfile] Load TechnicianProfile',
  props<{ technicianId: string }>()
);

export const loadTechnicianProfileSuccess = createAction(
  '[TechnicianProfile] Load TechnicianProfile Success',
  props<{ data: TechnicianProfile }>()
);

export const loadTechnicianProfileFailure = createAction('[TechnicianProfile] Load TechnicianProfile Failure');

export const loadTags = createAction('[TechnicianProfile] Load Tags');
export const loadTagsSuccess = createAction(
  '[TechnicianProfile] Load Tags Success',
  props<{ data: Tag[] }>()
);
export const loadTagsFailure = createAction('[TechnicianProfile] Load Tags Failure');

export const loadSkills = createAction(
  '[TechnicianProfile] Load Skills',
  props<{ technicianExternalId: string }>()
);
export const loadSkillsSuccess = createAction(
  '[TechnicianProfile] Load Skills Success',
  props<{ data: Skill[] }>()
);
export const loadSkillsFailure = createAction('[TechnicianProfile] Load Skills Failure');

export const resetTechProfileData = createAction('[TechnicianProfile] Reset data');

export const createTechnicianProfile = createAction(
  '[TechnicianProfile] Create',
  props<{
    profile: Partial<TechnicianProfile>,
    skills: SkillWithViewModelId[],
    certificates: NewSkillCertificate[],
  }>()
);
export const createTechnicianProfileSuccess = createAction(
  '[TechnicianProfile] Create Success',
  props<{profile: Partial<TechnicianProfile>}>()
);
export const createTechnicianProfileFailure = createAction('[TechnicianProfile] Create Failure');

export const saveTechnicianProfile = createAction(
  '[TechnicianProfile] Save TechnicianProfile',
  props<{
    profile: Partial<TechnicianProfile>;
    skills: {
      remove: Skill[];
      add: SkillWithViewModelId[];
    };
    certificates: {
      add: NewCertificateWithViewModelId[];
      remove: Skill[];
    };
  }>()
);
export const saveTechnicianProfileSuccess = createAction(
  '[TechnicianProfile] Save TechnicianProfile Success',
  props<{ profile: TechnicianProfile }>()
);
export const saveTechnicianProfileFailure = createAction('[TechnicianProfile] Save TechnicianProfile Failure');

export const addSkillToProfile = createAction(
  '[TechnicianProfile] Add Skill to Profile',
  props<{ skillViewModelId: string; }>()
);
export const removeSkillFromProfile = createAction(
  '[TechnicianProfile] Remove Skill from Profile',
  props<{ skillViewModelId: string; }>()
);

export const downloadCertificate = createAction(
  '[TechnicianProfile] Download Certificate',
  props<{ skill: Skill, technicianId: string, }>(),
);

export const addCertificateUpload = createAction(
  '[TechnicianProfile] Add Certificate file',
  props<{skillViewModelId: string, certificate: NewSkillCertificate}>(),
);
export const removeCertificateUpload = createAction(
  '[TechnicianProfile] Remove Certificate Upload',
  props<{skillViewModelId: string}>(),
);
export const deleteCertificate = createAction(
  '[TechnicianProfile] Delete Certificate',
  props<{skillViewModelId: string}>(),
);
export const undoDeleteCertificate = createAction(
  '[TechnicianProfile] Undo Deletion of Certificate',
  props<{skillViewModelId: string}>(),
);

export const expandTagDetailsView = createAction(
  '[TechnicianProfile] Expand skill details',
  props<{skillViewModelId: string}>(),
);
export const collapseTagDetailsView = createAction(
  '[TechnicianProfile] Collapse skill details',
  props<{skillViewModelId: string}>(),
);
