export interface CompanySettings {
  [key: string]: string;
}

export const exampleCompanySettings = (): CompanySettings => ({
  'SAP.FSM.Crowd.PartnerPortal.ReassignButtonDisplay': 'true',
  'SAP.FSM.Crowd.PartnerPortal.RejectButtonDisplay': 'false',
});
