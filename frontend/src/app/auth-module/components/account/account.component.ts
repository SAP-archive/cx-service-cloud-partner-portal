import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public account: string;

  constructor(private router: Router) {
  }

  public onSubmit() {
    this.router.navigateByUrl(`/login/account/${this.account}`);
  }
}
