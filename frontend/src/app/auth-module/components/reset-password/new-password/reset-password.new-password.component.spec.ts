import { of } from 'rxjs';
import { ResetPasswordNewPasswordComponent } from './reset-password.new-password.component';

describe('LoginComponent', () => {
  let component: ResetPasswordNewPasswordComponent;

  function setup() {
    const formBuilderSpy =  jasmine.createSpyObj('FormBuilder', ['group']);
    const resetPasswordFacadeSpy =  jasmine.createSpyObj('ResetPasswordFacade', [
      'isBusy$',
      'error$',
      'resetPassword',
    ]);
    const authServiceSpy = jasmine.createSpyObj('ResetPasswordFacade', ['getTranslatedPolicyError']);
    const getSpy = jasmine.createSpy();
    getSpy.and.returnValue({value: 'get-value'});
    formBuilderSpy.group.and.returnValue({ get: getSpy});

    resetPasswordFacadeSpy.isBusy$ = of(false);
    resetPasswordFacadeSpy.error$ = of(null);
    component = new ResetPasswordNewPasswordComponent(formBuilderSpy, resetPasswordFacadeSpy, authServiceSpy);
    return { formBuilderSpy, resetPasswordFacadeSpy };
  }

  describe('onSubmit()', () => {
    it('should success',  () => {
      const { resetPasswordFacadeSpy } = setup();
      component.onSubmit();
      expect(resetPasswordFacadeSpy.resetPassword).toHaveBeenCalledTimes(1);
    });
  });
});
