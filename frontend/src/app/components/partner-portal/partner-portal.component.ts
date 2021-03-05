import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state';
import { initLocalisation } from '../../state/user/user.actions';
import { LaunchDarklyClientService } from '../../services/launch-darkly-client.service';
import { ConfigFacade } from '../../state/config/config.facade';
import { filter, take } from 'rxjs/operators';
import { StatsFacade } from '../../state/stats/stats.facade';

@Component({
  selector: 'pp-partner-portal',
  templateUrl: './partner-portal.component.html',
  styleUrls: ['./partner-portal.component.scss'],
})
export class PartnerPortalComponent implements OnInit {
  constructor(
    private store: Store<fromRoot.RootState>,
    private launchDarkly: LaunchDarklyClientService,
    private configFacade: ConfigFacade,
    private statsFacade: StatsFacade,
  ) {
  }

  public ngOnInit(): void {
    this.store.dispatch(initLocalisation());
    this.configFacade.embeddedConfig.pipe(
      take(1),
      filter(config => !!config.launchdarklyKey)
    ).subscribe(embeddedConfig => {
      this.launchDarkly.initialize(embeddedConfig.launchdarklyKey, 'partner-portal', false);
    });
    this.statsFacade.initStats();
  }
}
