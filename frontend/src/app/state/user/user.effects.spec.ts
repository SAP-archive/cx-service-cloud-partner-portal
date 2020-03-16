import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserEffects } from './user.effects';
import { cold, hot } from 'jasmine-marbles';
import { changeLocalisation, initLocalisation } from './user.actions';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LocalisationService } from '../../services/localisation.service';
import * as fromAuth from '../../auth-module/state/auth.actions';

describe('UserEffects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let metadata: EffectsMetadata<UserEffects>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        {provide: LocalisationService, useValue: jasmine.createSpyObj<LocalisationService>(['getInitialLocalisation', 'setLocalisation'])},
      ],
    });

    effects = TestBed.get(UserEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('initLocalisation', () => {
    it('should guess the localisation from the browser', () => {
      const localisation = {
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      };
      TestBed.get(LocalisationService).getInitialLocalisation.and.returnValue(localisation);
      actions$ = hot('--a-b', {a: initLocalisation(), b: fromAuth.logoutSuccess});
      const expectedAction = changeLocalisation({
        localisation,
      });
      const expected = cold('--a-b', {
        a: expectedAction,
        b: expectedAction,
      });

      expect(effects.initLocalisation).toBeObservable(expected);
    });
  });

  describe('changeLocalisation', () => {
    it('should not dispatch any further actions', () => {
      const action = () => changeLocalisation({
        localisation: {
          code: 'pl',
          language: 'pl',
          name: 'Polish',
        },
      });
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      TestBed.get(LocalisationService).setLocalisation.and.returnValue(expected());

      expect(effects.changeLocalisation).toBeObservable(expected());
      expect(metadata.changeLocalisation.dispatch).toBe(false);
    });

    it('should set new localisation', () => {
      const localisationService = TestBed.get(LocalisationService);
      const newLocalisation = () => ({
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      });
      const action = () => changeLocalisation({localisation: newLocalisation()});
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      localisationService.setLocalisation.and.returnValue(expected());

      expect(effects.changeLocalisation).toBeObservable(expected());
      expect(localisationService.setLocalisation).toHaveBeenCalledWith(action().localisation);
    });
  });
});
