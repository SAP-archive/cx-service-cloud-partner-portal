import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthFacade } from '../../state/auth.facade';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authFacade.isLoggedIn.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return of(true);
        }

        this.authFacade.setRedirectTo(state.url);
        return of(this.router.parseUrl('/login'));
      }),
    );
  }
}
