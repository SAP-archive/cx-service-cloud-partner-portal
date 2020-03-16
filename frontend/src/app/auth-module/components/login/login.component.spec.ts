import { LoginComponent } from './login.component';
import { emptyCredentials, exampleCredentials } from '../../model/credentials.model';
import { cold } from 'jasmine-marbles';

describe('LoginComponent', () => {
  describe('ngOnInit()', () => {
    it('should populate credentials with account from url param', () => {
      const accountName = 'my-account';
      const activatedRoute = {snapshot: {params: {accountName}}};
      const component = new LoginComponent(activatedRoute as any, {isBusy: null} as any, null);

      component.ngOnInit();

      expect(component.credentials).toEqual({
        ...emptyCredentials(),
        accountName,
      });
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should focus on userName field', () => {
      const changeDetectorRef = jasmine.createSpyObj(['detectChanges']);
      const component = new LoginComponent(null, {isBusy: null} as any, changeDetectorRef);
      component.userNameInput = jasmine.createSpyObj(['focus']);

      component.ngAfterViewInit();

      expect(component.userNameInput.focus).toHaveBeenCalled();
      expect(changeDetectorRef.detectChanges).toHaveBeenCalled();
    });
  });

  it('should share isBusy observable from Auth Facade', () => {
    const busyObservable = () => cold('ab', {a: true, b: false});
    const component = new LoginComponent(null, {isBusy: busyObservable()} as any, null);

    expect(component.isBusy).toBeObservable(busyObservable());
  });

  describe('onSubmit()', () => {
    it('should login', () => {
      const authFacade = jasmine.createSpyObj(['login']);
      const component = new LoginComponent(null, authFacade as any, null);
      component.credentials = exampleCredentials();

      component.onSubmit();

      expect(authFacade.login).toHaveBeenCalledWith(exampleCredentials());
    });
  });
});
