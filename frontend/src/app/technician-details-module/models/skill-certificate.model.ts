export interface SkillCertificate {
  id: string;
  externalId: string;
  fileName: string;
}

export interface NewSkillCertificate {
  fileName: string;
  fileContents: string;
  contentType: string;
  skillId?: string;
  viewModelId?: string;
}

export type NewCertificateWithViewModelId = NewSkillCertificate & {viewModelId: string};

export const exampleNewSkillCertificate = (): NewSkillCertificate => ({
  fileName: 'dummy-file.pdf',
  fileContents: 'dummy-contents',
  contentType: 'application/pdf',
});
