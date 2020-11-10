export interface BusinessPartnerDto {
  readonly id: string;
  readonly name: string;
  readonly remarks: string | null;
  readonly inactive: boolean;
  readonly syncStatus: string | null;
}

export const exampleBusinessPartnerDto = (id: string = '1'): BusinessPartnerDto => ({
  id,
  name: 'A Company Ltd.',
  remarks: 'A solid partner',
  inactive: false,
  syncStatus: 'IN_CLOUD',
});
