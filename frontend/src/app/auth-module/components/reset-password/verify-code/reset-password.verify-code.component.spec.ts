import { of } from 'rxjs';
import { ResetPasswordVerifyCodeComponent } from './reset-password.verify-code.component';

describe('LoginComponent', () => {
  let component: ResetPasswordVerifyCodeComponent;

  function setup() {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const resetPasswordFacadeSpy = jasmine.createSpyObj('ResetPasswordFacade', [
      'data$', 'isBusy$',
      'error$', 'verifyVerificationCode'
    ]);

    resetPasswordFacadeSpy.data$ = of({
      verificationCode: 'testCode'
    });

    resetPasswordFacadeSpy.isBusy$ = of(false);
    resetPasswordFacadeSpy.error$ = of(null);

    component = new ResetPasswordVerifyCodeComponent(resetPasswordFacadeSpy, routerSpy);
    return { routerSpy, resetPasswordFacadeSpy };
  }

  describe('ngOnInit()', () => {
    it('should set data', () => {
      const { resetPasswordFacadeSpy } = setup();
      component.ngOnInit();
      expect(component.data).toEqual({
        verificationCode: 'testCode'
      });
      expect(component.isBusy$).toEqual(resetPasswordFacadeSpy.isBusy$);
    });
  });

  describe('onSubmit()', () => {
    it('should success', () => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      component.data = {
        verificationCode: 'testCode'
      };
      component.onSubmit();
      expect(resetPasswordFacadeSpy.verifyVerificationCode).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'newPassword']);
    });
  });

});
