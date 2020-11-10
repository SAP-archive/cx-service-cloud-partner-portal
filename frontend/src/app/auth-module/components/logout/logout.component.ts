import { Component } from '@angular/core';
import { AuthFacade } from '../../state/auth/auth.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'pp-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private authFacade: AuthFacade, private router: Router) {
    const extras = this.router.getCurrentNavigation().extras;
    if (extras && extras.state && extras.state.needLogout) {
      this.authFacade.logout();
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
