import { Contact, exampleContact } from '../../../models/Contact';
import { Address, exampleAddress } from '../../../models/Address';
import { exampleServiceArea, ServiceArea } from '../../../models/ServiceArea';
import { exampleBusinessPartnerDto } from '@modules/data-access/dtos/BusinessPartnerDto';

export interface CompanyDetailsDto {
  readonly id: string;
  readonly name: string;
  readonly remarks: string | null;
  readonly inactive: boolean;
  readonly contacts: Contact[];
  readonly address: Address;
  readonly serviceArea: ServiceArea;
}

export const exampleCompanyDetailsDto = (): CompanyDetailsDto => ({
  ...exampleBusinessPartnerDto(),
  contacts: [exampleContact()],
  address: exampleAddress(),
  serviceArea: exampleServiceArea(),
});
