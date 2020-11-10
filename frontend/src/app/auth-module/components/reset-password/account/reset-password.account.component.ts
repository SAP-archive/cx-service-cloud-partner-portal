import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, mergeMap, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ResetPasswordData } from '../../../model/reset-password-data.model';
import { ResetPasswordFacade } from '../../../state/resetPassword/reset-password.facade';
@Component({
  selector: 'reset-password-account',
  templateUrl: './reset-password.account.component.html',
  styleUrls: [
    './reset-password.account.component.scss'
  ]
})

export class ResetPasswordAccountComponent implements OnInit, OnDestroy {
  public data: Partial<ResetPasswordData>;
  public isBusy$: Observable<boolean> = this.resetPasswordFacade.isBusy$;
  private destroyed$ = new Subject<void>();
  constructor(
    private resetPasswordFacade: ResetPasswordFacade,
    private router: Router
  ) {
    this.data = {};
    this.isBusy$ = of(false);
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public ngOnInit() {
    this.resetPasswordFacade.data$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.data = _.cloneDeep(data);
    });
  }

  public onSubmit() {
    if (!!this.data.accountName && !!this.data.userName) {
      this.resetPasswordFacade.fetchPartialEmailAddress(this.data.accountName, this.data.userName);
      this.resetPasswordFacade.isBusy$.pipe(
        first(isLoading => !isLoading),
        mergeMap(() => this.resetPasswordFacade.error$),
        first()
      ).subscribe(error => {
        if (!error) {
          this.router.navigate(['login', 'resetPassword', 'confirmEmail']);
        }
      });
    }
  }

  public forgotAccount() {
    this.resetPasswordFacade.resetData();
    this.router.navigate(['login', 'resetPassword', 'confirmEmail']);
  }

}
