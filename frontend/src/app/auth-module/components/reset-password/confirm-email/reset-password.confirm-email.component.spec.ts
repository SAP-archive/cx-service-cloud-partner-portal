import { ResetPasswordConfirmEmailComponent } from './reset-password.confirm-email.component';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: ResetPasswordConfirmEmailComponent;

  function setup() {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const resetPasswordFacadeSpy: any = jasmine.createSpyObj('ResetPasswordFacade', [
      'data$', 'isBusy$',
      'error$', 'sendVerificationCode',
    ]);

    resetPasswordFacadeSpy.data$ = of({
      email: 'test@sap.com'
    });

    resetPasswordFacadeSpy.isBusy$ = of(false);
    resetPasswordFacadeSpy.error$ = of(null);

    component = new ResetPasswordConfirmEmailComponent(resetPasswordFacadeSpy, routerSpy);
    return { routerSpy, resetPasswordFacadeSpy };
  }

  describe('ngOnInit()', () => {
    it('should set data', () => {
      setup();
      component.ngOnInit();
      expect(component.data).toEqual({
        email: 'test@sap.com'
      });
    });
  });

  describe('onSubmit()', () => {
    it('should success', () => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      component.data = { email: 'test@sap.com' };
      component.onSubmit();
      expect(resetPasswordFacadeSpy.sendVerificationCode).toHaveBeenCalledWith('test@sap.com');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'verifyCode']);
    });
  });

});
