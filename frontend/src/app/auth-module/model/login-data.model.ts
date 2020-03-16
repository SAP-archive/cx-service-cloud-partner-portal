import { AuthData, exampleAuthData } from './auth-data.model';
import { exampleLocalisation, Localisation } from '../../components/localisation-selector/localisation';
import { examplePerson, UnifiedPerson } from '../../model/unified-person.model';

export interface LoginData {
  authData?: AuthData;
  localisation?: Localisation;
  passwordNeedsToBeChanged?: boolean;
  person?: UnifiedPerson;
  maxAttachmentSize?: number;
}

export const exampleLoginData = (): LoginData => ({
  authData: exampleAuthData(),
  localisation: exampleLocalisation(),
  passwordNeedsToBeChanged: false,
  person: examplePerson(),
  maxAttachmentSize: 1048576,
});
