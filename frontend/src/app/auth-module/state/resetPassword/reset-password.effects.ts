
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, first, switchMap, withLatestFrom } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import * as AuthActions from '../auth/auth.actions';
import * as resetPasswordActions from './reset-password.actions';
import { AuthService } from '../../../auth-module/services/auth.service';
import { ResetPasswordFacade } from './reset-password.facade';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { Router } from '@angular/router';

@Injectable()
export class ResetPasswordEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        private resetPasswordFacade: ResetPasswordFacade
    ) {
    }

    @Effect()
    public fetchPartialEmailAddress$ = this.actions$.pipe(
        ofType(resetPasswordActions.fetchPartialEmailAddress),
        switchMap(({ accountName, userName }) => this.authService.getPartialEmailAddress(accountName, userName)
            .pipe(
                map((response) => resetPasswordActions.fetchPartialEmailAddressSuccess(response)),
                catchError(error =>
                    of(resetPasswordActions.fetchPartialEmailAddressFail(error))))
        ));

    @Effect()
    public handleError$ = this.actions$.pipe(
        ofType(
            resetPasswordActions.fetchPartialEmailAddressFail,
            resetPasswordActions.sendVerificationCodeFailure,
            resetPasswordActions.verifyVerificationCodeFailure,
            resetPasswordActions.resetPasswordFailure),
        switchMap(({ error }) =>
            of(ReportingActions.reportError({ message: error.message }))
        ));


    @Effect()
    public sendVerificationCode$ = this.actions$.pipe(
        ofType(resetPasswordActions.sendVerificationCode),
        switchMap(({ email }) => this.authService.sendVerificationCode(email)
            .pipe(
                map(() => resetPasswordActions.sendVerificationCodeSuccess()),
                catchError(error =>
                    of(resetPasswordActions.sendVerificationCodeFailure(error))))
        ));

    @Effect()
    public verifyVerificationCode$ = this.actions$.pipe(
        ofType(resetPasswordActions.verifyVerificationCode),
        switchMap(({ verificationCode }) => this.authService.verifyVerificationCode(verificationCode)
            .pipe(
                map(() => resetPasswordActions.verifyVerificationCodeSuccess()),
                catchError(error =>
                    of(resetPasswordActions.verifyVerificationCodeFailure(error))))
        ));


    @Effect()
    public resendVerificationCode$ = this.actions$.pipe(
        ofType(resetPasswordActions.resendVerificationCode),
        mergeMap(() => {
            return this.resetPasswordFacade.data$.pipe(
                first(),
                mergeMap(data => {
                    const email = data.email;
                    if (!!email) {
                        return of(resetPasswordActions.sendVerificationCode({ email }));
                    } else {
                        return throwError({
                            code: -1,
                            message: 'missing email',
                            cloudError: null
                        });
                    }
                }),
            );
        }),
        catchError(error => {
            return of(resetPasswordActions.sendVerificationCodeFailure(error));
        })
    );

    @Effect()
    public resetPassword$ = this.actions$.pipe(
        ofType(resetPasswordActions.resetPassword),
        switchMap(({ newPassword }) => this.authService.resetPassword(newPassword).pipe(
            withLatestFrom(this.resetPasswordFacade.data$),
            switchMap(([, { accountName, userName }]) => {
                if (accountName && userName && newPassword) {
                    return of(
                        resetPasswordActions.resetPasswordSuccess(),
                        AuthActions.login({
                            credentials: {
                                accountName: accountName,
                                userName: userName,
                                password: newPassword,
                            },
                        }),
                    );
                } else {
                    this.router.navigate(['login']);
                    return of(resetPasswordActions.resetPasswordSuccess());
                }
            }),
            catchError((error) => of(resetPasswordActions.resetPasswordFailure(error))),
        ),
        ),
    );

}
