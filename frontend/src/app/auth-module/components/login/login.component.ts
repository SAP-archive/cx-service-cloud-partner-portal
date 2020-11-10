import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '../../state/auth/auth.facade';
import { Credentials, emptyCredentials } from '../../model/credentials.model';
import { MatInput } from '@angular/material/input';
import { ResetPasswordFacade } from '../../state/resetPassword/reset-password.facade';

@Component({
  selector: 'pp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('userName') public userNameInput: MatInput;
  public credentials: Credentials;
  public isBusy = this.authFacade.isBusy;

  constructor(
    private route: ActivatedRoute,
    private authFacade: AuthFacade,
    private router: Router,
    private resetPasswordFacade: ResetPasswordFacade,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.credentials = {
      ...emptyCredentials(),
      accountName: this.route.snapshot.params.accountName,
    };
  }

  public ngAfterViewInit(): void {
    this.userNameInput.focus();
    this.changeDetectorRef.detectChanges();
  }

  public onSubmit() {
    this.authFacade.login({ ...this.credentials });
  }

  public forgotPassword() {
    this.resetPasswordFacade.resetData();
    this.resetPasswordFacade.setData({accountName: this.credentials.accountName});
    this.router.navigate(['login', 'resetPassword', 'account']);
  }
  public forgotAccount() {
    this.router.navigate(['login']);
  }
}
