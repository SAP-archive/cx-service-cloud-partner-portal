import { State } from './technicians.reducer';
import * as fromTechnicians from './technicians.selectors';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Technician } from '../models/technician.model';
import * as techniciansActions from './technicians.actions';

@Injectable({providedIn: 'root'})
export class TechniciansFacade {
  public technicians: Observable<Technician[]> = this.store.select(fromTechnicians.selectTechnicians)
    .pipe(filter(state => !!state));

  public loadingTechnicians: Observable<boolean> = this.store.select(fromTechnicians.selectIsLoading);

  constructor(
    private store: Store<State>,
  ) {
  }

  public loadTechnicians() {
    this.store.dispatch(techniciansActions.loadTechnicians());
  }

  public deleteTechnician(technician: Technician) {
    this.store.dispatch(techniciansActions.deleteTechnician({technician}));
  }
}
