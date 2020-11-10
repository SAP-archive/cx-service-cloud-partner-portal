
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResetPasswordData } from '../../model/reset-password-data.model';
import * as resetPasswordActions from './reset-password.actions';
import * as resetPasswordSelector from './reset-password.selector';
import { RequestError } from '../../../auth-module/model/request-error.model';
import { RootState } from '../../../state';


@Injectable()
export class ResetPasswordFacade {

  constructor(
    private store: Store<RootState>
  ) { }

  public error$: Observable<RequestError | null> = this.store.select(resetPasswordSelector.selectResetPasswordError);
  public isBusy$: Observable<boolean> = this.store.select(resetPasswordSelector.selectIsBusy);
  public data$: Observable<ResetPasswordData> = this.store.select(resetPasswordSelector.selectResetPasswordData);

  public setData(data: Partial<ResetPasswordData>) {
    this.store.dispatch(resetPasswordActions.setData({ data }));
  }

  public fetchPartialEmailAddress(accountName: string, userName: string) {
    this.store.dispatch(resetPasswordActions.fetchPartialEmailAddress({
      accountName,
      userName
    }));
  }

  public fetchPartialEmailAddressSuccess(maskedEmail: string) {
    this.store.dispatch(resetPasswordActions.fetchPartialEmailAddressSuccess({ maskedEmail }));
  }

  public fetchPartialEmailAddressFail(error: RequestError) {
    this.store.dispatch(resetPasswordActions.fetchPartialEmailAddressFail({ error }));
  }

  public sendVerificationCode(email: string) {
    this.store.dispatch(resetPasswordActions.sendVerificationCode({ email }));
  }

  public verifyVerificationCode(verificationCode: string) {
    this.store.dispatch(resetPasswordActions.verifyVerificationCode({ verificationCode }));
  }

  public resendVerificationCode() {
    this.store.dispatch(resetPasswordActions.resendVerificationCode());
  }

  public resetPassword(newPassword: string) {
    this.store.dispatch(resetPasswordActions.resetPassword({ newPassword }));
  }

  public resetError() {
    this.store.dispatch(resetPasswordActions.resetError());
  }

  public resetData() {
    this.store.dispatch(resetPasswordActions.resetData());
  }

}
