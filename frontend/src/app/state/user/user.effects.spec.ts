import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserEffects } from './user.effects';
import { cold, hot } from 'jasmine-marbles';
import { selectLocalisation, initLocalisation, setCurrentLocalisation } from './user.actions';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LocalisationService } from '../../services/localisation.service';
import * as fromAuth from '../../auth-module/state/auth/auth.actions';
import SpyObj = jasmine.SpyObj;
import { exampleLoginData } from '../../auth-module/model/login-data.model';
import { loginSuccess } from '../../auth-module/state/auth/auth.actions';

describe('UserEffects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let metadata: EffectsMetadata<UserEffects>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        {
          provide: LocalisationService,
          useValue: jasmine.createSpyObj<LocalisationService>([
            'getInitialLocalisation',
            'selectLocalisation',
            'setLocalLocalisation',
            'setLocalisationWhenLoginSuccess'])
        },
      ],
    });

    effects = TestBed.inject(UserEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('initLocalisation', () => {
    it('should guess the localisation from the browser', () => {
      const localisation = {
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      };
      (TestBed.inject(LocalisationService) as SpyObj<LocalisationService>).getInitialLocalisation.and.returnValue(localisation);
      actions$ = hot('--a-b', {a: initLocalisation(), b: fromAuth.logoutSuccess});
      const expectedAction = setCurrentLocalisation({
        localisation,
      });
      const expected = cold('--a-b', {
        a: expectedAction,
        b: expectedAction,
      });

      expect(effects.initLocalisation).toBeObservable(expected);
    });
  });

  describe('setCurrentLocalisation', () => {
    it('should call setLocalLocalisation of LocalisationService', () => {
      const localisationService = TestBed.inject(LocalisationService) as SpyObj<LocalisationService>;
      const localisation = {
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      };
      const action = () => setCurrentLocalisation({ localisation });
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      localisationService.setLocalLocalisation.and.returnValue(expected());

      expect(effects.setCurrentLocalisation).toBeObservable(expected());
      expect(localisationService.setLocalLocalisation).toHaveBeenCalledWith(localisation);
    });
  });

  describe('selectLocalisation', () => {
    it('should not dispatch any further actions', () => {
      const action = () => selectLocalisation({
        localisation: {
          code: 'pl',
          language: 'pl',
          name: 'Polish',
        },
      });
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      (TestBed.inject(LocalisationService) as SpyObj<LocalisationService>).selectLocalisation.and.returnValue(expected());

      expect(effects.selectLocalisation).toBeObservable(expected());
      expect(metadata.selectLocalisation.dispatch).toBe(false);
    });

    it('should set new localisation', () => {
      const localisationService = TestBed.inject(LocalisationService) as SpyObj<LocalisationService>;
      const newLocalisation = () => ({
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      });
      const action = () => selectLocalisation({localisation: newLocalisation()});
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      localisationService.selectLocalisation.and.returnValue(expected());

      expect(effects.selectLocalisation).toBeObservable(expected());
      expect(localisationService.selectLocalisation).toHaveBeenCalledWith(action().localisation);
    });
  });

  describe('loginSuccess', () => {
    it('should set new localisation', () => {
      const localisationService = TestBed.inject(LocalisationService) as SpyObj<LocalisationService>;
      const newLocalisation = {
        code: 'pl',
        language: 'pl',
        name: 'Polish',
      };
      const action = () => loginSuccess({
        loginData: {
          ...exampleLoginData(),
          localisation: newLocalisation
        }
      });
      actions$ = hot('a', {a: action()});
      const expected = () => cold('b', {b: undefined});
      localisationService.setLocalisationWhenLoginSuccess.and.returnValue(expected());

      expect(effects.loginSuccess).toBeObservable(expected());
      expect(localisationService.setLocalisationWhenLoginSuccess).toHaveBeenCalledWith(newLocalisation);
    });
  });

});
