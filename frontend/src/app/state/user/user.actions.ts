import { createAction, props } from '@ngrx/store';
import { UnifiedPerson } from '../../model/unified-person.model';
import { Localisation } from '../../components/localisation-selector/localisation';

export const initLocalisation = createAction('[Config] Init Localisation');

export const setCurrentLocalisation = createAction(
  '[Config] Set current Localisation',
  props<{ localisation: Localisation }>(),
);

export const updateLocalisation = createAction(
  '[Config] send request to update Localisation',
  props<{ localisation: Localisation }>(),
);

export const selectLocalisation = createAction(
  '[Config] Customer Select One Localisation',
  props<{ localisation: Localisation }>(),
);

export const hasLocalisationBeenChangedBeforeLogin = createAction(
  '[Config] Mark true when localisation Changed before login',
  props<{ isLocalisationChangeNeeded: boolean }>(),
);

export const setPerson = createAction(
  '[User] Fetch Person',
  props<{ person: UnifiedPerson }>(),
);
