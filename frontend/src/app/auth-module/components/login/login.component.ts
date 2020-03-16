import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade } from '../../state/auth.facade';
import { Credentials, emptyCredentials } from '../../model/credentials.model';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'pp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('userName', {static: false}) public userNameInput: MatInput;
  public credentials: Credentials;
  public isBusy = this.authFacade.isBusy;

  constructor(private route: ActivatedRoute,
              private authFacade: AuthFacade,
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
    this.authFacade.login({...this.credentials});
  }
}
