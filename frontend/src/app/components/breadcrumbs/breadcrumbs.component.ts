import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pp-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {

  constructor(public router: Router) {
  }

  public isOnRootRoute(): boolean {
    return this.router.url === '/';
  }
}
