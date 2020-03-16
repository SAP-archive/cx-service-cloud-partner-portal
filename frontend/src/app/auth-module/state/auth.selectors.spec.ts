import * as fromAuth from './auth.reducer';
import { selectAuthState } from './auth.selectors';

describe('Auth Selectors', () => {
  it('should select the feature state', () => {
    const result = selectAuthState({
      [fromAuth.authFeatureKey]: {
        ...fromAuth.initialState
      }
    });

    expect(result).toEqual({...fromAuth.initialState});
  });
});
