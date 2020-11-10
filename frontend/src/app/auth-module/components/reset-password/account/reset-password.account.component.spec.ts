import { ResetPasswordAccountComponent } from './reset-password.account.component';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: ResetPasswordAccountComponent;

  function setup() {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const resetPasswordFacadeSpy: any = jasmine.createSpyObj('ResetPasswordFacade', [
      'data$', 'isBusy$',
      'error$', 'fetchPartialEmailAddress',
      'resetData',
    ]);

    resetPasswordFacadeSpy.data$ = of({
      accountName: 'my-account',
      userName: 'my-name'
    });

    resetPasswordFacadeSpy.isBusy$ = of(false);
    resetPasswordFacadeSpy.error$ = of(null);

    component = new ResetPasswordAccountComponent(resetPasswordFacadeSpy, routerSpy);
    return { routerSpy, resetPasswordFacadeSpy };
  }

  describe('ngOnInit()', () => {
    it('should set data', () => {
      setup();
      component.ngOnInit();
      expect(component.data).toEqual({
        accountName: 'my-account',
        userName: 'my-name'
      });
    });
  });

  describe('onSubmit()', () => {
    it('should success', () => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      component.ngOnInit();
      component.onSubmit();
      expect(resetPasswordFacadeSpy.fetchPartialEmailAddress).toHaveBeenCalledWith('my-account', 'my-name');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'confirmEmail']);
    });
  });

  describe('forgotAccount()', () => {
    it('should navigate', () => {
      const { routerSpy, resetPasswordFacadeSpy } = setup();
      component.forgotAccount();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'confirmEmail']);
      expect(resetPasswordFacadeSpy.resetData).toHaveBeenCalledTimes(1);
    });
  });

});
