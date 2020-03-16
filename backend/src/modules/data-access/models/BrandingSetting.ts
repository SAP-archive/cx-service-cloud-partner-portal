import { BrandingSettingKey } from '../types/BrandingSettingKey';

type SettingType = 'NUMBER' | 'STRING' | 'BOOLEAN' | 'COLOR' | 'HTML' | 'CLOUD_IDENTIFIER' | 'EMAIL' | 'PHONE' | 'URL';

export type BrandingSetting = {
  key: BrandingSettingKey;
  value: string;
  type: SettingType;
};

export const exampleBrandingSetting = (keyName: BrandingSettingKey = 'CrowdOwner.Contact.Name'): BrandingSetting => ({
  key: keyName,
  type: 'STRING',
  value: 'John Doe',
});
