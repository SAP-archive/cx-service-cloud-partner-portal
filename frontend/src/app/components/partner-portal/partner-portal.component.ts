import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state';
import { initLocalisation } from '../../state/user/user.actions';

@Component({
  selector: 'pp-partner-portal',
  templateUrl: './partner-portal.component.html',
  styleUrls: ['./partner-portal.component.scss'],
})
export class PartnerPortalComponent implements OnInit {
  constructor(private store: Store<fromRoot.RootState>) {
  }

  public ngOnInit(): void {
    this.store.dispatch(initLocalisation());
  }
}
