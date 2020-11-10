
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordsErrorStateMatcher } from '../../change-password/passwords-error-state.matcher';
import { ResetPasswordFacade } from '../../../../auth-module/state/resetPassword/reset-password.facade';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'pp-new-password',
  templateUrl: './reset-password.new-password.component.html',
  styleUrls: ['./reset-password.new-password.component.scss'],
})
export class ResetPasswordNewPasswordComponent {
  public changePasswordForm: FormGroup = this.formBuilder.group(
    {
      password: ['', [Validators.required]],
      confirmPassword: [],
    },
    { validator: this.checkPasswords },
  );
  public passwordsErrorStateMatcher = new PasswordsErrorStateMatcher();
  public isBusy = this.resetPasswordFacade.isBusy$;
  public error = this.resetPasswordFacade.error$;

  constructor(
    private formBuilder: FormBuilder,
    private resetPasswordFacade: ResetPasswordFacade,
    private authService: AuthService) {
  }

  public errorTranslate(error: string): Observable<string> {
    return this.authService.getTranslatedPolicyError(error);
  }

  public onSubmit() {
    this.resetPasswordFacade.resetPassword(this.changePasswordForm.get('password').value);
  }

  private checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }
}
