import { Localisation } from './localisation';

export const localisations: Localisation[] = [
  {
    code: 'cs',
    language: 'cs',
    name: 'Czech'
  },
  {
    code: 'da',
    language: 'da',
    name: 'Danish'
  },
  {
    code: 'de',
    language: 'de',
    name: 'German (Deutsch)'
  },
  {
    code: 'de-ch',
    language: 'de',
    name: 'German (Switzerland)'
  },
  {
    code: 'es',
    language: 'es',
    name: 'Spanish'
  },
  {
    code: 'en',
    language: 'en',
    name: 'English (United States)'
  },
  {
    code: 'en-au',
    language: 'en',
    name: 'English (Australia)'
  },
  {
    code: 'en-ca',
    language: 'en',
    name: 'English (Canada)'
  },
  {
    code: 'en-ie',
    language: 'en',
    name: 'English (Ireland)'
  },
  {
    code: 'en-nz',
    language: 'en',
    name: 'English (New Zealand)'
  },
  {
    code: 'en-gb',
    language: 'en',
    name: 'English (United Kingdom)'
  },
  {
    code: 'fi',
    language: 'fi',
    name: 'Finnish'
  },
  {
    code: 'fr',
    language: 'fr',
    name: 'French'
  },
  {
    code: 'fr-ca',
    language: 'fr',
    name: 'French (Canada)'
  },
  {
    code: 'fr-ch',
    language: 'fr',
    name: 'French (Switzerland)'
  },
  {
    code: 'he',
    language: 'he',
    name: 'Hebrew'
  },
  {
    code: 'hi',
    language: 'hi',
    name: 'Hindi'
  },
  {
    code: 'hu',
    language: 'hu',
    name: 'Hungarian'
  },
  {
    code: 'it',
    language: 'it',
    name: 'Italian'
  },
  {
    code: 'ja',
    language: 'ja',
    name: 'Japanese'
  },
  {
    code: 'ms',
    language: 'ms',
    name: 'Malay'
  },
  {
    code: 'nl',
    language: 'nl',
    name: 'Dutch'
  },
  {
    code: 'nl-be',
    language: 'nl',
    name: 'Dutch (Belgium)'
  },
  {
    code: 'no',
    language: 'no',
    name: 'Norwegian'
  },
  {
    code: 'pl',
    language: 'pl',
    name: 'Polish'
  },
  {
    code: 'pt',
    language: 'pt',
    name: 'Portuguese'
  },
  {
    code: 'pt-br',
    language: 'pt',
    name: 'Portuguese (Brazil)'
  },
  {
    code: 'ro',
    language: 'ro',
    name: 'Romanian'
  },
  {
    code: 'ru',
    language: 'ru',
    name: 'Russian'
  },
  {
    code: 'sk',
    language: 'sk',
    name: 'Slovak'
  },
  {
    code: 'sv',
    language: 'sv',
    name: 'Swedish'
  },
  {
    code: 'ta',
    language: 'ta',
    name: 'Tamil'
  },
  {
    code: 'zh-cn',
    locale: 'zh-cn',
    language: 'zh-hans',
    name: 'Chinese (China)'
  },
  {
    code: 'zh-hant',
    locale: 'zh-cn',
    language: 'zh-hant',
    name: 'Chinese (Traditional)'
  },
  {
    code: 'zh-hk',
    locale: 'zh-hk',
    language: 'zh-hans',
    name: 'Chinese (Hong Kong)'
  },
  {
    code: 'zh',
    locale: 'zh-cn',
    language: 'zh-hans',
    name: 'Chinese (China)'
  },
];

export const findLocalisation = (languageCode: string) => {
  const target = localisations.find(localisation => localisation.code === languageCode);
  if (target) {
    return target;
  }

  return {
    code: 'en-gb',
    language: 'en',
    name: 'English (United Kingdom)'
  };
};
