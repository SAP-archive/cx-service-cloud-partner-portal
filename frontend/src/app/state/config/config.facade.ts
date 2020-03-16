import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../index';
import { EmbeddedConfig } from '../../../environments/embedded-config';
import { selectAppConfig, selectEmbeddedConfig, selectMaxAttachmentSize } from './config.selectors';
import { Observable } from 'rxjs';
import { AppConfig } from '../../model/app-config.model';

@Injectable({providedIn: 'root'})
export class ConfigFacade {
  public embeddedConfig: Observable<EmbeddedConfig> = this.store.select(selectEmbeddedConfig);
  public appConfig: Observable<AppConfig> = this.store.select(selectAppConfig);
  public maxAttachmentSize = this.store.select(selectMaxAttachmentSize);

  constructor(private store: Store<RootState>) {
  }
}
