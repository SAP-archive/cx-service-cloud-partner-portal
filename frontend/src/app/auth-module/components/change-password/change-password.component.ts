import { Component } from '@angular/core';
import { PasswordsErrorStateMatcher } from './passwords-error-state.matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacade } from '../../state/auth/auth.facade';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'pp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  public changePasswordForm: FormGroup = this.formBuilder.group(
    {
      password: ['', [Validators.required]],
      confirmPassword: [],
    },
    {validator: this.checkPasswords},
  );
  public passwordsErrorStateMatcher = new PasswordsErrorStateMatcher();
  public isBusy = this.authFacade.isBusy;
  public error = this.authFacade.passwordPolicyError;

  constructor(private formBuilder: FormBuilder,
              private authFacade: AuthFacade,
              private authService: AuthService) {
  }

  public onSubmit() {
    this.authFacade.changePassword(this.changePasswordForm.get('password').value);
  }

  public errorTranslate(error: string): Observable<string> {
    return this.authService.getTranslatedPolicyError(error);
  }

  private checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : {notSame: true};
  }
}
