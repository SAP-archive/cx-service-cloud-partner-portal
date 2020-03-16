import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/state';
import { Observable } from 'rxjs';
import { UnifiedPerson } from '../../model/unified-person.model';
import { selectPerson } from '../../state/user/user.selectors';
import { filter, take } from 'rxjs/operators';
import { setPerson } from '../../state/user/user.actions';
import { AuthFacade } from '../../auth-module/state/auth.facade';

@Component({
  styleUrls: ['dashboard.component.scss'],
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent {
  public person: Observable<UnifiedPerson>;
  public companyName: Observable<string>;

  constructor(
    private store: Store<RootState>,
    private authFacade: AuthFacade,
  ) {
    this.person = store.pipe(
      select(selectPerson),
      filter(person => !!person),
    );

    this.companyName = this.authFacade.companyName;
  }
}
