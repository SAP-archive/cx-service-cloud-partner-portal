import { userDefaultState, userReducer } from './user.reducer';
import { UnifiedPerson } from '../../model/unified-person.model';
import {
  setCurrentLocalisation,
  selectLocalisation,
  hasLocalisationBeenChangedBeforeLogin,
  setPerson
} from './user.actions';
import { exampleLocalisation } from '../../components/localisation-selector/localisation';
import { loginSuccess } from '../../auth-module/state/auth/auth.actions';
import { exampleLoginData } from '../../auth-module/model/login-data.model';

describe('UserReducer', () => {
  describe('userReducer()', () => {
    it('should skip irrelevant actions', () => {
      const newState = userReducer(undefined, {} as any);
      expect(newState).toEqual(userDefaultState);
    });

    describe('on setPerson', () => {
      it('should set person', () => {
        const person: UnifiedPerson = {
          id: '12345',
        } as any;
        const newState = userReducer(
          undefined,
          setPerson({person}),
        );
        expect(newState.person).toEqual(person);
      });
    });

    describe('on setCurrentLocalisation', () => {
      it('should set localisation from action', () => {
        const newState = userReducer(
          undefined,
          setCurrentLocalisation({localisation: exampleLocalisation()}),
        );
        expect(newState.localisation).toEqual(exampleLocalisation());
      });
    });

    describe('on selectLocalisation', () => {
      it('should set localisation from action', () => {
        const newState = userReducer(
          undefined,
          selectLocalisation({localisation: exampleLocalisation()}),
        );
        expect(newState.localisation).toEqual(exampleLocalisation());
      });
    });

    describe('on set hasLocalisationBeenChangedBeforeLogin', () => {
      it('should set hasLocalisationBeenChangedBeforeLogin', () => {
        const isLocalisationChangeNeeded = true;
        const newState = userReducer(
          undefined,
          hasLocalisationBeenChangedBeforeLogin({isLocalisationChangeNeeded}),
        );
        expect(newState.isLocalisationChangeNeeded).toEqual(true);
      });
    });

    describe('on loginSuccess', () => {
      it('should set localisation from login data', () => {
        const newState = userReducer(
          undefined,
          loginSuccess({loginData: exampleLoginData()}),
        );
        expect(newState.localisation).toEqual(exampleLoginData().localisation);
      });

      it('should not set localisation from login data if empty', () => {
        const newState = userReducer(
          userDefaultState,
          loginSuccess({loginData: {...exampleLoginData(), localisation: undefined}}),
        );

        expect(newState.localisation).toEqual(userDefaultState.localisation);
      });
    });
  });
});
