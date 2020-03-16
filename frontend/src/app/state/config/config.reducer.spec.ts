import * as fromConfig from './config.reducer';
import { loginSuccess } from '../../auth-module/state/auth.actions';

describe('Config Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = fromConfig.reducer(fromConfig.initialState, action);
      expect(result).toBe(fromConfig.initialState);
    });
  });

  describe('on loginSuccess', () => {
    it('should set maxAttachmentSize', () => {
      const action = loginSuccess({
        loginData: {
          maxAttachmentSize: 5,
        },
      });
      const result = fromConfig.reducer(fromConfig.initialState, action);
      expect(result.maxAttachmentSize).toEqual(5);
    });
  });
});
