import { AuthGuard } from './auth.guard';
import { of } from 'rxjs';
import { UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  describe('canActivate', () => {
    describe('if logged in', () => {
      it('should return an observable emitting true', (done) => {
        const authFacade = {isLoggedIn: of(true)};
        const guard = new AuthGuard(authFacade as any, null);

        guard.canActivate(null, null).subscribe(result => {
          expect(result).toBe(true);
          done();
        });
      });
    });

    describe('if logged out', () => {
      it('should redirect to login page', (done) => {
        const urlTree = () => (new UrlTree());
        const authFacade = {isLoggedIn: of(false), setRedirectTo: () => null};
        const router = {parseUrl: jasmine.createSpy().withArgs('/login').and.returnValue(urlTree())};
        const guard = new AuthGuard(authFacade as any, router as any);

        guard.canActivate(null, {} as any).subscribe(result => {
          expect(result).toEqual(urlTree());
          done();
        });
      });

      it('should set redirect to url to the one user tried to access', (done) => {
        const urlTree = () => (new UrlTree());
        const authFacade = {isLoggedIn: of(false), setRedirectTo: jasmine.createSpy()};
        const router = {parseUrl: jasmine.createSpy().withArgs('/login').and.returnValue(urlTree())};
        const guard = new AuthGuard(authFacade as any, router as any);

        const redirectUrl = 'some/path;id=1';
        guard.canActivate(null, {url: redirectUrl} as any).subscribe(() => {
          expect(authFacade.setRedirectTo).toHaveBeenCalledWith(redirectUrl);
          done();
        });
      });
    });
  });
});
