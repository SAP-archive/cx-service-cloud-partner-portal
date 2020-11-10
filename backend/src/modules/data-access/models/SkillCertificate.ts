export interface NewSkillCertificate {
  fileName: string;
  fileContents: string;
  contentType: string;
  viewModelId?: string;
  skillId?: string;
}

export const exampleNewSkillCertificate = (skillId = 'TAG123', viewModelId: string = 'VIEWMODEL123'): NewSkillCertificate => ({
  fileName: 'dummy.pdf',
  fileContents: 'I am a dummy',
  skillId,
  contentType: 'application/pdf',
  viewModelId: viewModelId,
});
