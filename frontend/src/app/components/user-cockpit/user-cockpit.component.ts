import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pp-user-cockpit',
  templateUrl: './user-cockpit.component.html',
  styleUrls: ['./user-cockpit.component.scss'],
})
export class UserCockpitComponent {
  constructor(private router: Router) {
  }

  public logout() {
    this.router.navigateByUrl('/logout', { state: { needLogout: true }});
  }
}
