import { emptyTag, exampleTag, Tag } from './tag.model';
import { exampleSkill, Skill } from './skill.model';
import * as uuid from 'uuid';
import { NewSkillCertificate } from './skill-certificate.model';

export interface SkillViewModel {
  id: string;
  tag?: Tag;
  skill?: Skill;
  selected: boolean;
  expanded: boolean;
  newCertificate?: NewSkillCertificate;
  certificateToBeDeleted: boolean;
}

export const exampleSkillViewModel = (id: string = 'SkillViewModel123'): SkillViewModel => ({
  id,
  tag: exampleTag(),
  skill: exampleSkill(),
  expanded: false,
  selected: false,
  certificateToBeDeleted: false,
});

export const emptySkillViewModel = (skill?: Skill, tag: Tag = emptyTag()): SkillViewModel => ({
  id: uuid(),
  tag,
  skill,
  selected: false,
  expanded: false,
  certificateToBeDeleted: false,
});
