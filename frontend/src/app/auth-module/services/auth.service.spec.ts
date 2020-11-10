import { exampleResetPasswordData } from './../model/reset-password-data.model';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { exampleCredentials } from '../model/credentials.model';
import { exampleAuthData } from '../model/auth-data.model';
import { cold } from 'jasmine-marbles';
import { exampleLoginData, LoginData } from '../model/login-data.model';
import { examplePerson } from '../../model/unified-person.model';
import { take } from 'rxjs/operators';

let authService: AuthService;
function setup() {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['redirectTo', 'authUserData']);
  const appBackendServiceSpy = jasmine.createSpyObj('AppBackendService', ['post', 'delete']);
  const resetPasswordFacadeSpy = jasmine.createSpyObj('ResetPasswordFacade', ['data$']);
  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['getTranslatedPolicyError']);
  resetPasswordFacadeSpy.data$ = of(exampleResetPasswordData());
  authFacadeSpy.redirectTo = of('my-url');
  authFacadeSpy.authUserData = of(exampleAuthData());

  authService = new AuthService(routerSpy, authFacadeSpy, appBackendServiceSpy, resetPasswordFacadeSpy, translateServiceSpy);
  return { routerSpy, authFacadeSpy, appBackendServiceSpy, resetPasswordFacadeSpy };
}
describe('AuthService', () => {

  describe('redirectAfterLogin()', () => {
    it('should redirect to route coming from Auth Facade', () => {
      const { routerSpy } = setup();
      authService.redirectAfterLogin();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('my-url');
    });
  });

  describe('redirectToPasswordChangeRoute()', () => {
    it('should redirect to password change route', () => {
      const { routerSpy } = setup();
      authService.redirectToPasswordChangeRoute();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login/change-password');
    });
  });

  describe('login()', () => {
    it('should send a request to login', () => {
      const { appBackendServiceSpy } = setup();

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
      appBackendServiceSpy.post
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

      expect(authService.login(exampleCredentials())).toBeObservable(cold('a', { a: expectedResponse }));
    });

    describe('if locale code is not set', () => {
      it('the localisation should be undefined', (done) => {
        const { appBackendServiceSpy } = setup();
        appBackendServiceSpy.post.and.returnValue(of({ body: { localeCode: '' } }));
        authService.login(exampleCredentials()).pipe(take(1)).subscribe(response => {
          expect(response.localisation).toBeUndefined();
          done();
        });
      });
    });
  });

  describe('changePassword()', () => {
    it('should send a request to change password', (done) => {
      const { appBackendServiceSpy } = setup();
      const newPassword = 'p4ssw0rd';
      const changePasswordData = {
        oldPassword: exampleAuthData().password,
        newPassword,
        userName: exampleAuthData().userName,
        accountName: exampleAuthData().accountName,
      };
      appBackendServiceSpy.post
        .withArgs('/auth/changePassword', changePasswordData)
        .and.returnValue(of({ body: {} }));

      authService.changePassword(newPassword).subscribe((response) => {
        expect(!!response).toEqual(true);
        done();
      });
    });
  });

  describe('redirectAfterLogout()', () => {
    it('should redirect to login route', () => {
      const { routerSpy } = setup();
      authService.redirectAfterLogout();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('logout()', () => {
    it('should send a request to logout', () => {
      const { appBackendServiceSpy } = setup();
      appBackendServiceSpy.delete
        .withArgs('/auth/logout')
        .and.returnValue(cold('a', { a: { body: undefined } }));
      expect(authService.logout()).toBeObservable(cold('a', { a: undefined }));
    });
  });

  describe('getPartialEmailAddress()', () => {
    it('return masked email', (done) => {
      const { appBackendServiceSpy } = setup();
      const userName = 'my-name';
      const accountName = 'my-account';

      appBackendServiceSpy.post
        .withArgs('/auth/resetPassword/userPartialEmailAddress', {
          userName,
          accountName
        }).and.returnValue(of({
          body: {
            maskedEmail: '***email.@sap.com'
          }
        }));
      authService.getPartialEmailAddress(accountName, userName).subscribe(
        response => {
          expect(response).toEqual({ maskedEmail: '***email.@sap.com' });
          done();
        }
      );
    });
  });

  describe('sendVerificationCode()', () => {
    it('sendVerificationCode success', () => {
      const { appBackendServiceSpy } = setup();
      const userName = exampleResetPasswordData().userName;
      const accountName = exampleResetPasswordData().accountName;
      const user_email_address = exampleResetPasswordData().email;

      appBackendServiceSpy.post
        .withArgs('/auth/resetPassword/sendVerificationCode', {
          userName, accountName, user_email_address
        }).and.returnValue(cold('a'));

      expect(authService.sendVerificationCode(user_email_address))
        .toBeObservable(cold('a'));
    });
  });

  describe('verifyVerificationCode()', () => {
    it('verifyVerificationCode success', (done) => {
      const { appBackendServiceSpy } = setup();
      const userName = exampleResetPasswordData().userName;
      const accountName = exampleResetPasswordData().accountName;
      const user_email_address = exampleResetPasswordData().email;
      const verification_code = exampleResetPasswordData().verificationCode;
      appBackendServiceSpy.post
        .withArgs('/auth/resetPassword/verifyVerificationCode', {
          userName,
          accountName,
          user_email_address,
          verification_code
        }).and.returnValue(of(null));

      authService.verifyVerificationCode(verification_code)
        .subscribe((response) => {
          expect(response).toEqual(null);
          done();
        });
    });
  });

  describe('resetPassword()', () => {
    it('resetPassword success', () => {
      const { appBackendServiceSpy, resetPasswordFacadeSpy } = setup();
      const userName = exampleResetPasswordData().userName;
      const accountName = exampleResetPasswordData().accountName;
      const user_email_address = exampleResetPasswordData().email;
      const verification_code = exampleResetPasswordData().verificationCode;
      const password = exampleResetPasswordData().newPassword;

      appBackendServiceSpy.post
        .withArgs('/auth/resetPassword', {
          userName,
          accountName,
          password,
          user_email_address,
          verification_code
        }).and.returnValue(cold('a'));

      expect(authService.resetPassword(password))
        .toBeObservable(cold('a'));
    });
  });

});
