import { of } from 'rxjs';
import { ResetPasswordHasVerificationCodeGuard } from './has-verification-code.guard';

describe('ResetPasswordHasEmailGuard', () => {
  let gurad: ResetPasswordHasVerificationCodeGuard;

  function setup() {
    const routerSpy =  jasmine.createSpyObj('Router', ['parseUrl']);
    const resetPasswordFacadeSpy =  jasmine.createSpyObj('ResetPasswordFacade', ['data$']);
    resetPasswordFacadeSpy.data$ = of({
      verificationCode: 'verification code'
    });
    gurad = new ResetPasswordHasVerificationCodeGuard(resetPasswordFacadeSpy, routerSpy);
    return { routerSpy, resetPasswordFacadeSpy };
  }

  describe('canActivate()', () => {
    it('should equal to of(true)', (done) => {
      setup();
      gurad.canActivate().subscribe(flag => {
        expect(flag).toEqual(true);
        done();
      });
    });

    it('should equal to of(url)', (done) => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      resetPasswordFacadeSpy.data$ = of({});
      gurad.canActivate().subscribe(() => {
        expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
        done();
      });
    });
  });
});
