import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../index';
import { EmbeddedConfig } from '../../../environments/embedded-config';
import {
  selectAllowAssignmentClose,
  selectAllowAssignmentHandover,
  selectAllowReject,
  selectAppConfig,
  selectAreCompanySettingsLoaded,
  selectEmbeddedConfig,
  selectMaxAttachmentSize,
} from './config.selectors';
import { Observable } from 'rxjs';
import { AppConfig } from '../../model/app-config.model';
import { fetchCompanySettings } from './config.actions';
import { take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ConfigFacade {
  public embeddedConfig: Observable<EmbeddedConfig> = this.store.select(selectEmbeddedConfig);
  public appConfig: Observable<AppConfig> = this.store.select(selectAppConfig);
  public maxAttachmentSize = this.store.select(selectMaxAttachmentSize);
  public allowAssignmentHandover = this.store.select(selectAllowAssignmentHandover);
  public allowAssignmentClose = this.store.select(selectAllowAssignmentClose);
  public allowAssignmentReject = this.store.select(selectAllowReject);
  public selectAreCompanySettingsLoaded = this.store.select(selectAreCompanySettingsLoaded);

  constructor(private store: Store<RootState>) {
  }

  public fetchCompanySettingsIfNotLoadedYet() {
    this.selectAreCompanySettingsLoaded.pipe(
      take(1),
    ).subscribe(areSettingsLoaded => {
      if (!areSettingsLoaded) {
        this.store.dispatch(fetchCompanySettings());
      }
    });
  }
}
