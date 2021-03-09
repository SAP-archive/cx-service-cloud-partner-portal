import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../index';
import { initStats } from './stats.actions';

@Injectable({providedIn: 'root'})
export class StatsFacade {
  constructor(private store: Store<RootState>) {
  }

  public initStats() {
    this.store.dispatch(initStats());
  }
}
