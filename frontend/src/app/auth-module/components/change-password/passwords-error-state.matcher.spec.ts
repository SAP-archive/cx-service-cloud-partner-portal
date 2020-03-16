import { cases } from 'jasmine-parameterized';
import { PasswordsErrorStateMatcher } from './passwords-error-state.matcher';

describe('PasswordsErrorStateMatcher', () => {
  cases([
    {
      invalid: true,
      parent: {
        dirty: true,
      },
    },
    {
      invalid: false,
      dirty: true,
      parent: {
        invalid: true,
        dirty: true,
      },
    },
  ])
    .it('should return true', (control) => {
      const matcher = new PasswordsErrorStateMatcher();
      expect(matcher.isErrorState(control, null)).toBe(true);
    });

  cases([
    {
      invalid: false,
      dirty: true,
      parent: {
        invalid: false,
        dirty: true,
      },
    },
    {
      invalid: true,
      dirty: false,
      parent: {
        invalid: true,
        dirty: false,
      },
    },
    {
      invalid: false,
      dirty: false,
      parent: {
        invalid: true,
        dirty: true,
      },
    },
  ])
    .it('should return false', (control) => {
      const matcher = new PasswordsErrorStateMatcher();
      expect(matcher.isErrorState(control, null)).toBe(false);
    });
});
