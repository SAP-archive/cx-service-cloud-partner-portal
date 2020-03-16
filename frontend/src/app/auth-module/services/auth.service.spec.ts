import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { exampleCredentials } from '../model/credentials.model';
import { exampleAuthData } from '../model/auth-data.model';
import { cold } from 'jasmine-marbles';
import { exampleLoginData, LoginData } from '../model/login-data.model';
import { examplePerson } from '../../model/unified-person.model';
import { take } from 'rxjs/operators';

describe('AuthService', () => {
  describe('redirectAfterLogin()', () => {
    it('should redirect to route coming from Auth Facade', () => {
      const routeUrl = '/my-route;id=1';
      const routerMock = jasmine.createSpyObj(['navigateByUrl']);
      const authFacadeMock = {redirectTo: of(routeUrl)};
      const service = new AuthService(routerMock as any, authFacadeMock as any, null);

      service.redirectAfterLogin();

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(routeUrl);
    });
  });

  describe('redirectToPasswordChangeRoute()', () => {
    it('should redirect to password change route', () => {
      const routerMock = jasmine.createSpyObj(['navigateByUrl']);
      const service = new AuthService(routerMock as any, null, null);

      service.redirectToPasswordChangeRoute();

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login/change-password');
    });
  });

  describe('login()', () => {
    it('should send a request to login', () => {
      const appBackendServiceMock = jasmine.createSpyObj(['post']);
      const service = new AuthService(null, null, appBackendServiceMock);
      const maxAttachmentSize = 5;
      const expectedResponse: LoginData = {
        ...exampleLoginData(),
        authData: {
          ...exampleAuthData(),
        },
        passwordNeedsToBeChanged: false,
        person: examplePerson(),
        localisation: {
          code: 'en-gb',
          language: 'en',
          name: 'English (United Kingdom)',
        },
        maxAttachmentSize,
      };
      appBackendServiceMock.post
        .withArgs('/auth/login', exampleCredentials())
        .and.returnValue(cold('a', {
        a: {
          body: {
            authData: exampleAuthData(),
            passwordNeedsToBeChanged: false,
            person: examplePerson(),
            localeCode: 'en-gb',
            maxAttachmentSize,
          },
        },
      }));

      expect(service.login(exampleCredentials())).toBeObservable(cold('a', {a: expectedResponse}));
    });

    describe('if locale code is not set', () => {
      it('the localisation should be undefined', (done) => {
        const appBackendServiceMock = jasmine.createSpyObj(['post']);
        appBackendServiceMock.post.and.returnValue(of({body: {localeCode: ''}}));
        const service = new AuthService(null, null, appBackendServiceMock);
        service.login(exampleCredentials()).pipe(take(1)).subscribe(response => {
          expect(response.localisation).toBeUndefined();
          done();
        });
      });
    });
  });

  describe('changePassword()', () => {
    it('should send a request to change password', () => {
      const appBackendServiceMock = jasmine.createSpyObj(['post']);
      const authFacadeMock = {authUserData: of(exampleAuthData())};
      const service = new AuthService(null, authFacadeMock as any, appBackendServiceMock);
      const newPassword = 'p4ssw0rd';
      const changePasswordData = {
        newPassword,
        oldPassword: exampleAuthData().password,
        userName: exampleAuthData().userName,
        accountName: exampleAuthData().accountName,
      };
      appBackendServiceMock.post
        .withArgs('/auth/changePassword', changePasswordData)
        .and.returnValue(cold('a', {a: {body: undefined}}));

      expect(service.changePassword(newPassword)).toBeObservable(cold('a', {a: undefined}));
    });
  });

  describe('redirectAfterLogout()', () => {
    it('should redirect to login route', () => {
      const routerMock = jasmine.createSpyObj(['navigateByUrl']);
      const service = new AuthService(routerMock as any, null, null);

      service.redirectAfterLogout();

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('logout()', () => {
    it('should send a request to logout', () => {
      const appBackendServiceMock = jasmine.createSpyObj(['delete']);
      const service = new AuthService(null, null, appBackendServiceMock);
      appBackendServiceMock.delete
        .withArgs('/auth/logout')
        .and.returnValue(cold('a', {a: {body: undefined}}));

      expect(service.logout()).toBeObservable(cold('a', {a: undefined}));
    });
  });
});
