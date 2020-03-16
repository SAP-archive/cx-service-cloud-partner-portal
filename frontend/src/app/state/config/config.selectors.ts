import { createSelector } from '@ngrx/store';
import * as fromRoot from '../index';
import * as fromConfig from './config.reducer';

export const selectConfig = (state: fromRoot.RootState) => state.config;

export const selectEmbeddedConfig = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.embeddedConfig,
);

export const selectAppConfig = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.appConfig,
);

export const selectMaxAttachmentSize = createSelector(
  selectConfig,
  (state: fromConfig.State) => state.maxAttachmentSize,
);
