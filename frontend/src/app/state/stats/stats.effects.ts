import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class StatsEffects {
  // Add Effects for handling app usage statistics using analytics provider like Google Analytics or Countly

  constructor(private actions$: Actions) {
  }
}
