import { ChangePasswordComponent } from './change-password.component';
import { FormBuilder } from '@angular/forms';
import { PasswordsErrorStateMatcher } from './passwords-error-state.matcher';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

describe('ChangePasswordComponent', () => {
  const componentFactory = (authFacade = {isBusy: of(false)}): ChangePasswordComponent =>
    new ChangePasswordComponent(new FormBuilder(), authFacade as any);

  it('should share isBusy observable from Auth Facade', () => {
    const busyObservable = () => cold('ab', {a: true, b: false});
    const component = componentFactory({isBusy: busyObservable()} as any);

    expect(component.isBusy).toBeObservable(busyObservable());
  });

  describe('onSubmit()', () => {
    it('should change password', () => {
      const newPassword = 'new p4ssw0rd';
      const authFacadeMock = jasmine.createSpyObj(['changePassword']);
      const component = componentFactory(authFacadeMock);

      component.changePasswordForm.setValue({password: newPassword, confirmPassword: newPassword});
      component.onSubmit();

      expect(authFacadeMock.changePassword).toHaveBeenCalledWith(newPassword);
    });
  });

  describe('passwordsErrorStateMatcher', () => {
    it('should be an instance of PasswordsErrorStateMatcher', () => {
      const component = componentFactory();

      expect(component.passwordsErrorStateMatcher).toBeInstanceOf(PasswordsErrorStateMatcher);
    });
  });

  describe('changePasswordForm', () => {
    describe('field password', () => {
      it('should be invalid when empty', () => {
        const component = componentFactory();
        const passwordControl = component.changePasswordForm.get('password');

        expect(passwordControl.invalid).toBeTrue();
        passwordControl.setValue('p455w0rd');
        expect(passwordControl.invalid).toBeFalse();
      });
    });

    it('should be valid only if confirm password is non-empty and the same as password', () => {
      const component = componentFactory();
      const passwordControl = component.changePasswordForm.get('password');
      const confirmPasswordControl = component.changePasswordForm.get('confirmPassword');

      expect(component.changePasswordForm.valid).toBeFalse();

      passwordControl.setValue('password');
      confirmPasswordControl.setValue('password');
      expect(component.changePasswordForm.valid).toBeTrue();

      confirmPasswordControl.setValue('different password');
      expect(component.changePasswordForm.valid).toBeFalse();
    });
  });
});
