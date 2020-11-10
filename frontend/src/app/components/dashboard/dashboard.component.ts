import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../state';
import { Observable } from 'rxjs';
import { UnifiedPerson } from '../../model/unified-person.model';
import { selectPerson } from '../../state/user/user.selectors';
import { filter } from 'rxjs/operators';
import { CrowdOwnerProfileFacade } from '../../crowd-owner-profile-module/state/crowd-owner-profile.facade';

@Component({
  styleUrls: ['dashboard.component.scss'],
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent {
  public person: Observable<UnifiedPerson>;
  public crowdName: Observable<string>;
  public showAssignmentsCard: Promise<boolean>;

  constructor(
    private store: Store<RootState>,
    private crowdOwnerProfileFacade: CrowdOwnerProfileFacade,
  ) {
    this.person = this.store.pipe(
      select(selectPerson),
      filter(person => !!person),
    );

    this.crowdName = this.crowdOwnerProfileFacade.crowdName;
  }
}
