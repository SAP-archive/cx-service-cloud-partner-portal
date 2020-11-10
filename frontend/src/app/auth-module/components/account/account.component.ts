import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'pp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  @ViewChild('accountInput') public accountInput: MatInput;
  public account: string;

  constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.accountInput.focus();
    this.changeDetectorRef.detectChanges();
  }

  public onSubmit() {
    this.router.navigateByUrl(`/login/account/${this.account}`);
  }
}
