import { State } from './technicians.reducer';
import * as fromTechnicians from './technicians.selectors';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Technician } from '../models/technician.model';
import { FetchingParams } from '../models/fetchingPrams.model';
import * as techniciansActions from './technicians.actions';

@Injectable({providedIn: 'root'})
export class TechniciansFacade {
  public technicians: Observable<Technician[]> = this.store.select(fromTechnicians.selectTechnicians);
  public loadingTechnicians: Observable<boolean> = this.store.select(fromTechnicians.selectIsLoading);
  public hasFetchedAll: Observable<boolean>  = this.store.select(fromTechnicians.selectHasFetchedAll);
  public fetchingParams: Observable<FetchingParams>  = this.store.select(fromTechnicians.selectFetchingParams);

  constructor(
    private store: Store<State>,
  ) {
  }

  public searchTechnicians(name: string) {
    this.store.dispatch(techniciansActions.searchTechnicians({name}));
  }

  public loadTechnicians() {
    this.store.dispatch(techniciansActions.loadTechnicians());
  }
}
