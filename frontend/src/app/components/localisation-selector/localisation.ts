export interface Localisation {
  code: string;
  name: string;
  language: string;
  locale?: string;
}

export const exampleLocalisation = (): Localisation => ({
  code: 'en',
  language: 'en',
  name: 'English (United States)',
});

