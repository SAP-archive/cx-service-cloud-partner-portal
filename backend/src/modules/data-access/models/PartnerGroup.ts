import { UnifiedPerson, exampleUnifiedPerson } from '../../../models/UnifiedPerson';

export interface PartnerGroup {
  id: string;
  code: string;
  name: string;
  contactPerson: Partial<UnifiedPerson>;
}

export const examplePartnerGroup = () => ({
  id: '1',
  code: '002',
  name: 'G2',
  contactPerson: exampleUnifiedPerson(),
});
