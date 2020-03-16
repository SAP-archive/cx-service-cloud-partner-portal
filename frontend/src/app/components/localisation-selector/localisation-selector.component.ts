import { Component, OnInit } from '@angular/core';
import { Localisation } from './localisation';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../state';
import * as selectFromUser from '../../state/user/user.selectors';
import { Observable } from 'rxjs';
import { localisations } from './localisations';
import { changeLocalisation } from '../../state/user/user.actions';

@Component({
  selector: 'pp-localisation-selector',
  templateUrl: './localisation-selector.component.html',
  styleUrls: ['./localisation-selector.component.scss']
})
export class LocalisationSelectorComponent implements OnInit {
  public localisations: Localisation[] = localisations;
  public selectedLocalisation: Observable<Localisation>;

  constructor(private store: Store<fromRoot.RootState>) {
  }

  public ngOnInit() {
    this.selectedLocalisation = this.store
      .pipe(select(selectFromUser.selectLocalisation));
  }

  public selectLanguage(code: Localisation['code']) {
    this.store.dispatch(changeLocalisation({
      localisation: this.localisations.find(localisation => localisation.code === code)
    }));
  }
}
