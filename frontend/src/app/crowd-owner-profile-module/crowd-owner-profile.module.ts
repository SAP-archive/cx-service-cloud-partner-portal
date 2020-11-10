import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrowdOwnerProfileTileComponent } from './components/crowd-owner-profile-tile/crowd-owner-profile-tile.component';
import { CrowdOwnerProfileMaterialModule } from './crowd-owner-profile-material-module';
import { translateModule } from '../utils/translate.module';
import { StoreModule } from '@ngrx/store';
import * as fromCompanyProfile from './state/crowd-owner-profile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CrowdOwnerProfileEffects } from './state/crowd-owner-profile.effects';
import { FakeDataModule } from '../fake-data-module/fake-data.module';
import { crowdOwnerProfileFeatureKey } from './state/feature.selectors';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';
import { AuthModule } from '../auth-module/auth.module';
import { CrowdOwnerProfileService } from './services/crowd-owner-profile.service';
import { CrowdOwnerProfileFacade } from './state/crowd-owner-profile.facade';

@NgModule({
  declarations: [
    CrowdOwnerProfileTileComponent,
  ],
  imports: [
    CommonModule,
    CrowdOwnerProfileMaterialModule,
    translateModule,
    FakeDataModule,
    AuthModule,
    AbbreviatePipeModule,
    StoreModule.forFeature(crowdOwnerProfileFeatureKey, {
      companyProfile: fromCompanyProfile.reducer,
    }),
    EffectsModule.forFeature([CrowdOwnerProfileEffects]),
  ],
  providers: [
    CrowdOwnerProfileService,
    CrowdOwnerProfileFacade,
  ],
  exports: [
    CrowdOwnerProfileTileComponent,
  ],
})
export class CrowdOwnerProfileModule {
}
