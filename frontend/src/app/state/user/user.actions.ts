import { createAction, props } from '@ngrx/store';
import { UnifiedPerson } from '../../model/unified-person.model';
import { Localisation } from '../../components/localisation-selector/localisation';

export const initLocalisation = createAction('[Config] Init Localisation');

export const changeLocalisation = createAction(
  '[Config] Change Localisation',
  props<{ localisation: Localisation }>(),
);

export const setPerson = createAction(
  '[User] Fetch Person',
  props<{ person: UnifiedPerson }>(),
);
