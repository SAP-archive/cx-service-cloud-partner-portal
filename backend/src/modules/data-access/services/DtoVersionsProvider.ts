import { DtoName } from '../types/DtoName';

const DTO_VERSIONS: { [name: string]: number } = {
  'Approval': 13,
  'Attachment': 16,
  'BusinessPartner': 20,
  'BusinessPartnerGroup': 14,
  'CompanyInfo': 15,
  'CompanySettings': 14,
  'Equipment': 18,
  'Requirement': 8,
  'Skill': 8,
  'Tag': 8,
  'Tax': 9,
  'UdfMeta': 13,
  'UdfMetaGroup': 10,
  'CrowdBusinessPartner': 8,
  'UnifiedPerson': 9,
  'ProfileObject': 22,
};

export class DtoVersionProvider {
  public static getVersionsParameter(DtoNames: DtoName[]): string {
    return DtoNames
      .map(name => {
        if (!DTO_VERSIONS[name]) {
          throw new Error(`no DTO version found for ${name}`);
        }
        return `${name}.${DTO_VERSIONS[name]}`;
      }).join(';');
  }

  public static getVersion(dtoName: DtoName): number {
    return DTO_VERSIONS[dtoName];
  }
}
