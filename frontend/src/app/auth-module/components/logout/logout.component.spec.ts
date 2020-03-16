import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  describe('logout()', () => {
    it('should logout', () => {
      const authFacade = { logout: jasmine.createSpy() };
      const router = {
        getCurrentNavigation: () => {
          return {
            extras: {
              state: {
                needLogout: true
              }
            }
          };
        }, navigateByUrl: jasmine.createSpy()
      };
      new LogoutComponent(authFacade as any, router as any);
      expect(authFacade.logout).toHaveBeenCalled();
    });

    it('shoul redirect to login', () => {
      const authFacade = { logout: jasmine.createSpy() };
      const router = {
        getCurrentNavigation: () => {
          return {
            extras: {
              state: {
                needLogout: false
              }
            }
          };
        }, navigateByUrl: jasmine.createSpy()
      };
      new LogoutComponent(authFacade as any, router as any);
      expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('shoul redirect to login', () => {
      const authFacade = { logout: jasmine.createSpy() };
      const router = {
        getCurrentNavigation: () => {
          return {
            extras: {}
          };
        }, navigateByUrl: jasmine.createSpy()
      };
      new LogoutComponent(authFacade as any, router as any);
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });
});
