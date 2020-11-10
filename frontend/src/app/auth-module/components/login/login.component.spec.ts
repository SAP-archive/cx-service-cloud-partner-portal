import { LoginComponent } from './login.component';
import { emptyCredentials, exampleCredentials } from '../../model/credentials.model';
import { cold } from 'jasmine-marbles';

describe('LoginComponent', () => {
  let component: LoginComponent;

  function setup() {
    const routeSpy =  jasmine.createSpyObj('Route', ['snapshot']);
    routeSpy.snapshot =  {params: {accountName: 'my-account'}};

    const authFacadeSpy =  jasmine.createSpyObj('AuthFacade', ['login', 'isBusy']);
    const busyObservable = () => cold('ab', {a: true, b: false});
    authFacadeSpy.isBusy = busyObservable();

    const routerSpy =  jasmine.createSpyObj('Router', ['navigate']);
    const resetPasswordFacadeSpy =  jasmine.createSpyObj('ResetPasswordFacade', ['resetData', 'setData']);
    const changeDetectorRefSpy =  jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    component = new LoginComponent(routeSpy, authFacadeSpy,
      routerSpy, resetPasswordFacadeSpy, changeDetectorRefSpy);

    return { routeSpy, authFacadeSpy, routerSpy, resetPasswordFacadeSpy, changeDetectorRefSpy };
  }

  describe('ngOnInit()', () => {
    it('should populate credentials with account from url param', () => {
      setup();
      component.ngOnInit();
      expect(component.credentials).toEqual({
        ...emptyCredentials(),
        accountName: 'my-account',
      });
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should focus on userName field', () => {
      const { changeDetectorRefSpy } = setup();
      component.userNameInput = jasmine.createSpyObj(['focus']);
      component.ngAfterViewInit();

      expect(component.userNameInput.focus).toHaveBeenCalled();
      expect(changeDetectorRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  it('should share isBusy observable from Auth Facade', () => {
    const busyObservable = () => cold('ab', {a: true, b: false});
    setup();
    expect(component.isBusy).toBeObservable(busyObservable());
  });

  describe('onSubmit()', () => {
    it('should login', () => {
      const { authFacadeSpy } = setup();
      component.credentials = exampleCredentials();
      component.onSubmit();
      expect(authFacadeSpy.login).toHaveBeenCalledWith(exampleCredentials());
    });
  });

  describe('forgotPassword()', () => {
    it('should navigate', () => {
      const { resetPasswordFacadeSpy, routerSpy } = setup();
      component.credentials = exampleCredentials();
      component.forgotPassword();
      expect(resetPasswordFacadeSpy.resetData).toHaveBeenCalled();
      expect(resetPasswordFacadeSpy.setData).toHaveBeenCalledWith({ accountName: 'my-account'});
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login', 'resetPassword', 'account']);
    });
  });

  describe('forgotAccount()', () => {
    it('should navigate', () => {
      const { routerSpy } = setup();
      component.forgotAccount();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });
  });

});
