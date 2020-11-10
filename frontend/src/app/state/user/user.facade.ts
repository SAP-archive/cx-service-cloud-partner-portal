import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '..';
import { selectIsLocalisationChangeNeeded, selectLocalisation } from './user.selectors';
import * as UserAction from './user.actions';
import { Localisation } from '../../components/localisation-selector/localisation';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  public currentLocalisation = this.store.select(selectLocalisation);
  public isLocalisationChangeNeeded = this.store.select(selectIsLocalisationChangeNeeded);

  constructor(private store: Store<RootState>) {
  }

  public setIsLocalisationChangeNeeded(isLocalisationChangeNeeded: boolean) {
    this.store.dispatch(UserAction.hasLocalisationBeenChangedBeforeLogin({ isLocalisationChangeNeeded }));
  }

  public setCurrentLocalisation(localisation: Localisation) {
    this.store.dispatch(UserAction.setCurrentLocalisation({ localisation }));
  }
}
