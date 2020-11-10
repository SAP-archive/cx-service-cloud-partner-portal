import { exampleResetPasswordData } from './../../../model/reset-password-data.model';
import { of } from 'rxjs';
import { ResetPasswordResendCodeComponent } from './reset-password.resend-code.component';

describe('LoginComponent', () => {
  let component: ResetPasswordResendCodeComponent;

  function setup() {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const resetPasswordFacadeSpy = jasmine.createSpyObj('ResetPasswordFacade', [
      'data$', 'isBusy$',
      'error$', 'resendVerificationCode',
      'resetError'
    ]);

    resetPasswordFacadeSpy.data$ = of(exampleResetPasswordData());

    resetPasswordFacadeSpy.isBusy$ = of(false);
    resetPasswordFacadeSpy.error$ = of(null);

    component = new ResetPasswordResendCodeComponent(resetPasswordFacadeSpy, routerSpy);
    return { routerSpy, resetPasswordFacadeSpy };
  }

  describe('ngOnInit()', () => {
    it('should set data', () => {
      setup();
      component.ngOnInit();
      expect(component.data).toEqual(exampleResetPasswordData());
    });
  });

  describe('onSubmit()', () => {
    it('should success', () => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      component.onSubmit();
      expect(resetPasswordFacadeSpy.resendVerificationCode).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'verifyCode']);
    });
  });

});
