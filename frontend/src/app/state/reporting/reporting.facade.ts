import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ReportingActions from './reporting.actions';
export interface State {
}
export const initialState: State = {
};

@Injectable({
  providedIn: 'root',
})
export class ReportingFacade {
  constructor(
    private store: Store<State>,
  ) {
  }

  public reportError(message: string) {
    this.store.dispatch(ReportingActions.reportError({message}));
  }

  public reportWarning(message: string) {
    this.store.dispatch(ReportingActions.reportWarning({message}));
  }

  public reportSuccess(message: string) {
    this.store.dispatch(ReportingActions.reportSuccess({message}));
  }
}
